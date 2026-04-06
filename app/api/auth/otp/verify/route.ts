import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getUserBySupabaseUid, createUser } from '@/lib/db/users';
import { signToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const DEV_BYPASS_CODE = '884895';

export async function POST(req: NextRequest) {
  try {
    const { email, token, role, displayName, password } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: 'Email and OTP code are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const hasSupabase = !!(supabaseUrl && supabaseKey);

    // DEV BYPASS
    if (token === DEV_BYPASS_CODE) {
      console.log(`[EVOPRIME] Dev bypass used for ${email}`);
    } else if (!hasSupabase) {
      return NextResponse.json({ error: 'OTP service not configured' }, { status: 503 });
    } else {
      // Create a fresh Supabase client per request to avoid stale state
      const supabase = createClient(supabaseUrl!, supabaseKey!);

      // Try verifying as email OTP (6-digit code from signInWithOtp)
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      console.log('[OTP Verify] data:', JSON.stringify(data), 'error:', JSON.stringify(error));

      if (error) {
        // If 'email' type fails, try 'magiclink' type as fallback
        const { data: data2, error: error2 } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'magiclink',
        });

        if (error2) {
          console.error('[OTP Verify] Both types failed:', error.message, error2.message);
          return NextResponse.json({ 
            error: `Invalid or expired code. ${error.message}` 
          }, { status: 401 });
        }

        console.log('[OTP Verify] magiclink type succeeded');
      }
    }

    // Sync with local users table
    let user = await getUserByEmail(email);

    if (!user) {
      const { hashPassword } = await import('@/lib/auth/password');
      const passwordHash = password ? await hashPassword(password) : undefined;
      
      user = await createUser({
        email,
        role: role || 'trainee',
        displayName: displayName || email.split('@')[0],
        passwordHash,
      });
    }

    // Generate session JWT
    const localToken = await signToken({
      sub: user.id.toString(),
      email: user.email,
      role: user.role as any,
      displayName: user.display_name,
    });

    const cookieStore = await cookies();
    cookieStore.set('evoprime_token', localToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        displayName: user.display_name,
        isVerified: user.is_verified,
      }
    });

  } catch (err: any) {
    console.error('[OTP Verify Fatal Error]', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Verification failed. Please try again.' }, { status: 500 });
  }
}
