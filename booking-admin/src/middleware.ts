import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('auth');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/');
  const currentPath = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    currentPath.startsWith('/_next') ||
    currentPath.startsWith('/api') ||
    currentPath.startsWith('/static') ||
    currentPath.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected pages
  if (!isAuthenticated && !isAuthPage && currentPath !== '/') {
    const loginUrl = new URL('/auth/sign-in', request.url);
    loginUrl.searchParams.set('redirect', currentPath);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage) {
    const redirectPath = request.nextUrl.searchParams.get('redirect') || '/';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
