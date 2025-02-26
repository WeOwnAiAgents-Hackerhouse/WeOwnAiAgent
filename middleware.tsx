import type { NextAuthOptions } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
  ],
  callbacks: {
    // authorized({ auth, request: { nextUrl } }) {
    //   const isLoggedIn = !!auth?.user;
    //   const isOnChat = nextUrl.pathname.startsWith('/');
    //   const isOnRegister = nextUrl.pathname.startsWith('/register');
    //   const isOnLogin = nextUrl.pathname.startsWith('/login');

    //   if (isLoggedIn && (isOnLogin || isOnRegister)) {
    //     return Response.redirect(new URL('/', nextUrl as unknown as URL));
    //   }

    //   if (isOnRegister || isOnLogin) {
    //     return true; // Always allow access to register and login pages
    //   }

    //   if (isOnChat) {
    //     if (isLoggedIn) return true;
    //     return false; // Redirect unauthenticated users to login page
    //   }

    //   if (isLoggedIn) {
    //     return Response.redirect(new URL('/', nextUrl as unknown as URL));
    //   }

    //   return true;
    // },
  },
} satisfies  NextAuthOptions;

// Export the middleware function
export function middleware(request: Request) {
  // Implement your middleware logic here
  // You can use the authConfig to check authorization
  // // You can use the authConfig to check authorization
  // const { pathname } = request;

  // // Example: Check if the user is authorized
  // const isAuthorized = authConfig.callbacks.authorized ? 
  //   authConfig.callbacks.authorized({ auth: {}, request }) : true; // Check if authorized callback exists

  // if (!isAuthorized) {
  //   return Response.redirect(new URL('/login', request.url));
  // }

  // return Response;

}
