import type { Role } from './db';

export interface JWTPayload {
  sub: string; // user id as string
  email: string;
  role: Role;
  displayName: string;
  iat?: number;
  exp?: number;
}

export interface Session {
  userId: number;
  email: string;
  role: Role;
  displayName: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  displayName: string;
  avatarUrl: string | null;
}
