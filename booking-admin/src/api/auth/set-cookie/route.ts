// src/app/api/auth/set-cookie/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { jwt, userRole, userName, userEmail } = await req.json();

    if (!jwt || !userRole || !userName || !userEmail) {
      return NextResponse.json({ message: 'Missing authentication data' }, { status: 400 });
    }

    // Set secure cookies with proper options
    const response = NextResponse.json({ message: 'Cookies set successfully' });

    // Set JWT cookie as HttpOnly
    response.cookies.set('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Set other cookies as non-HttpOnly for client-side access
    const cookieConfig = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    };

    response.cookies.set('auth', 'true', cookieConfig);
    response.cookies.set('userRole', userRole, cookieConfig);
    response.cookies.set('userName', userName, cookieConfig);
    response.cookies.set('userEmail', userEmail, cookieConfig);

    // Add a header to indicate successful cookie setting
    response.headers.set('X-Cookies-Set', 'true');

    return response;
  } catch (error) {
    console.error('Error setting cookies:', error);
    return NextResponse.json({ message: 'Failed to set cookies' }, { status: 500 });
  }
}
