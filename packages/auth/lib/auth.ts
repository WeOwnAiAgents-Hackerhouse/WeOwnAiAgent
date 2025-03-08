import { compare } from 'bcrypt-ts';
import NextAuth, { type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Import from database package - this will be resolved at runtime
// @ts-ignore
import { getUser } from '@myira/database';

import { authConfig } from './auth.config';
import { type Session } from './session';

export const { auth, signIn, signOut, GET, POST } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      // Define credentials configuration
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUser({ email: credentials.email });

        if (!user || !user.password) return null;

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({
      session,
      token,
    }) {
      if (session.user) {
        // Add id to user object
        (session.user as any).id = token.id as string;
      }

      return session as Session;
    },
  },
}); 