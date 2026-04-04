import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser } from '@/lib/db/users';
import { createCoachProfile } from '@/lib/db/coaches';
import { createTraineeProfile } from '@/lib/db/trainees';
import { seedExercises } from '@/lib/db/exercises';
import { comparePassword, hashPassword } from '@/lib/auth/password';
import { signToken } from '@/lib/auth/jwt';
import { COOKIE_NAME } from '@/lib/auth/session';

async function seedDemoAccounts() {
  const demos = [
    { email: 'admin@evoprime.com', password: 'admin123', role: 'admin', displayName: 'Admin User' },
    { email: 'coach@evoprime.com', password: 'coach123', role: 'coach', displayName: 'Coach Alex' },
    { email: 'trainee@evoprime.com', password: 'trainee123', role: 'trainee', displayName: 'Athlete Jordan' },
  ];

  for (const demo of demos) {
    const existing = await getUserByEmail(demo.email);
    if (!existing) {
      const passwordHash = await hashPassword(demo.password);
      const user = await createUser({ email: demo.email, passwordHash, role: demo.role, displayName: demo.displayName });
      if (demo.role === 'coach') await createCoachProfile(user.id);
      if (demo.role === 'trainee') await createTraineeProfile(user.id);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    await seedExercises();
    await seedDemoAccounts();

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    if (!user.is_active) return NextResponse.json({ error: 'Account suspended' }, { status: 403 });

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

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
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
