import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'evoprime-super-secret-key-change-in-production-32bytes'
);

const COOKIE_NAME = 'evoprime_token';

const ROLE_ROUTES: Record<string, string[]> = {
  admin: ['/admin'],
  coach: ['/coach'],
  trainee: ['/trainee'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Check if route is protected
  const protectedRole = Object.entries(ROLE_ROUTES).find(([, paths]) =>
    paths.some(p => pathname.startsWith(p))
  )?.[0];

  if (!protectedRole) return NextResponse.next();

  if (!token) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    if (role !== protectedRole) {
      const dashboards: Record<string, string> = {
        admin: '/admin',
        coach: '/coach',
        trainee: '/trainee',
      };
      return NextResponse.redirect(new URL(dashboards[role] || '/auth', request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/coach/:path*', '/trainee/:path*'],
};
