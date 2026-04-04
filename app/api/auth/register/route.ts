import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/db/users';
import { createCoachProfile } from '@/lib/db/coaches';
import { createTraineeProfile } from '@/lib/db/trainees';
import { seedExercises } from '@/lib/db/exercises';
import { hashPassword } from '@/lib/auth/password';
import { signToken } from '@/lib/auth/jwt';
import { COOKIE_NAME } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    await seedExercises();

    const { email, password, displayName, role } = await req.json();
    if (!email || !password || !displayName || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (!['coach', 'trainee'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ errors: { password: 'Password must be at least 8 characters' } }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ errors: { email: 'Email already in use' } }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ email, passwordHash, role, displayName });

    if (role === 'coach') await createCoachProfile(user.id);
    else await createTraineeProfile(user.id);

    const token = await signToken({
      sub: String(user.id),
      email: user.email,
      role: user.role,
      displayName: user.display_name,
    });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, role: user.role, displayName: user.display_name, avatarUrl: user.avatar_url },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
