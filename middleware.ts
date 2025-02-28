import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Check for wallet authentication
  const walletAuthCookie = request.cookies.get('wallet-auth')?.value;
  
  // Check for NextAuth session
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  const isAuthenticated = !!token || !!walletAuthCookie;
  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/register');
  const isHomePage = request.nextUrl.pathname === '/';

  // Allow API routes to pass through
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow access to the homepage for everyone
  if (isHomePage) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect dashboard and chat routes
  if (!isAuthenticated && 
      (request.nextUrl.pathname.startsWith('/chat') || 
       request.nextUrl.pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/chat/:path*', '/dashboard', '/login', '/register'],
};
