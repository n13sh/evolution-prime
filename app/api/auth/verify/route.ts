import { NextRequest, NextResponse } from 'next/server';
import { verifyUser, getUserById } from '@/lib/db/users';
import { signToken } from '@/lib/auth/jwt';
import { getSession, COOKIE_NAME } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.userId;
    const success = await verifyUser(userId, code);

    if (!success) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Update token with verified status
    const token = await signToken({
      sub: String(user.id),
      email: user.email,
      role: user.role,
      displayName: user.display_name,
    });

    const response = NextResponse.json({ success: true, user: { role: user.role } });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Verify error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
