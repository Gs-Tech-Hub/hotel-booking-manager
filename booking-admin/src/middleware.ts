import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/bookings',
  '/rooms',
  '/products',
  '/restaurant',
  '/bar',
  '/games',
  '/swimming',
  '/kitchen',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.css')
  ) {
    return NextResponse.next();
  }

  const isAuthPage = pathname.startsWith('/auth/');

  // For now, we'll let the client-side handle the auth checks
  // This is a temporary solution until we implement proper server-side auth
  if (isAuthPage) {
    return NextResponse.next();
  }

  // Handle protected routes
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route)) || pathname === '/';
  if (isProtected) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.png).*)',
  ],
};
