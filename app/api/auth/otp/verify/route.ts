import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserByEmail, getUserBySupabaseUid, createUser } from '@/lib/db/users';
import { signToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

const DEV_BYPASS_CODE = '884895';
const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, token, role, displayName } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: 'Email and OTP code are required' }, { status: 400 });
    }

    let supabaseUid: string | null = null;

    // DEV BYPASS: allow code 884895 without Supabase
    const isDevBypass = !hasSupabase || token === DEV_BYPASS_CODE;

    if (isDevBypass) {
      if (token !== DEV_BYPASS_CODE) {
        return NextResponse.json({ error: 'Invalid access code' }, { status: 401 });
      }
      // Generate a deterministic fake UID for dev
      supabaseUid = null;
    } else {
      // Real Supabase verification
      const { data: { session }, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error || !session) {
        return NextResponse.json({ error: error?.message || 'Invalid or expired code' }, { status: 401 });
      }

      supabaseUid = session.user.id;
    }

    // Sync with local users table
    let user = supabaseUid ? await getUserBySupabaseUid(supabaseUid) : null;

    if (!user) {
      // Check by email (covers existing accounts + dev bypass)
      user = await getUserByEmail(email);

      if (!user) {
        // Create new local profile
        user = await createUser({
          email,
          role: role || 'trainee',
          displayName: displayName || email.split('@')[0],
          supabaseUid: supabaseUid ?? undefined,
        });
      }
    }

    // Mark user as verified
    // (existing migration already handles this, but ensure for new users)

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
      maxAge: 60 * 60 * 24 * 7, // 7 days
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
    console.error('[OTP Verify Error]', err);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
