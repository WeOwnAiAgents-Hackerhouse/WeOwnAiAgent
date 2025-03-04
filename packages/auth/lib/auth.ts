import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@weown/database';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
}

export const { auth, signIn, signOut, GET, POST } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
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
        session.user.id = token.id as string;
      }

      return session;
    },
  },
}); 