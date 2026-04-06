import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserByEmail, getUserBySupabaseUid, createUser } from '@/lib/db/users';
import { signToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, token, role, displayName } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const { data: { session }, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error || !session) {
      return NextResponse.json({ error: error?.message || 'Invalid OTP' }, { status: 401 });
    }

    const supabaseUid = session.user.id;

    // Sync with local users table
    let user = await getUserBySupabaseUid(supabaseUid);
    
    if (!user) {
      // Check by email in case of legacy account bridge
      user = await getUserByEmail(email);
      
      if (user) {
        // Link existing account (migration path)
        // Note: For production, you might want to add an 'updateUserSupabaseUid' function
        // For now, we'll just proceed or create if missing
      } else {
        // Create new local profile
        user = await createUser({
          email,
          role: role || 'trainee',
          displayName: displayName || email.split('@')[0],
          supabaseUid,
        });
      }
    }

    // Generate local legacy session JWT for backward compatibility
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
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
