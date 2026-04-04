import 'server-only';
import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import type { Session } from '@/types/auth';

export const COOKIE_NAME = 'evoprime_token';

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return {
    userId: parseInt(payload.sub),
    email: payload.email,
    role: payload.role,
    displayName: payload.displayName,
  };
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireRole(role: string | string[]): Promise<Session> {
  const session = await requireSession();
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(session.role)) {
    throw new Error('Forbidden');
  }
  return session;
}
