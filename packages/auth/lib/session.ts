import { type Session as NextAuthSession } from 'next-auth';
import { cookies } from 'next/headers';

// Import from database package - this will be resolved at runtime
// @ts-ignore
import { getUser } from '@myira/database';

/**
 * Extended Session type that includes user information
 */
export interface Session extends NextAuthSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    address?: string | null;
  };
}

/**
 * Session result type for unified session handling
 */
export interface SessionResult {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    address?: string | null;
  } | null;
  provider: 'next-auth' | 'wallet' | null;
}

/**
 * Get the current session from either next-auth or wallet authentication
 */
export async function getSession(): Promise<SessionResult | null> {
  // First check for Next-Auth session
  const { auth } = await import('./auth');
  const session = await auth();
  
  if (session?.user) {
    return { 
      user: session.user,
      provider: 'next-auth'
    };
  }
  
  // If no Next-Auth session, check for wallet session
  const walletAddress = cookies().get('wallet_auth')?.value;
  
  if (walletAddress) {
    const user = await getUser({ walletAddress });
    
    if (user) {
      return {
        user: {
          id: user.id,
          address: walletAddress
        },
        provider: 'wallet'
      };
    }
  }
  
  // No authenticated session found
  return null;
}

/**
 * Session adapter that provides a unified interface for session management
 */
export const sessionAdapter = {
  /**
   * Get the current session
   */
  getSession,
  
  /**
   * Check if the user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session?.user;
  },
  
  /**
   * Get the current user
   */
  async getUser(): Promise<Session['user'] | null> {
    const session = await getSession();
    return session?.user || null;
  },
  
  /**
   * Get the authentication provider
   */
  async getProvider(): Promise<'next-auth' | 'wallet' | null> {
    const session = await getSession();
    return session?.provider || null;
  }
}; 