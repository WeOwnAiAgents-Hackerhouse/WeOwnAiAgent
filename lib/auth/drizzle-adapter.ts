import { and, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { user, account, session, verificationToken } from '@/lib/db/schema';
import { User, Account, Session, VerificationToken } from '@/lib/types'; // Adjust the import path as necessary

export function DrizzleAdapter(db: any) {
  return {
    async createUser(data: User) {
      const userId = nanoid();
      await db.insert(user).values({
        id: userId,
        email: data.email,
        name: data.name,
        emailVerified: data.emailVerified,
        image: data.image,
      });
      
      const createdUser = await db.query.user.findFirst({
        where: eq(user.id, userId),
      });
      
      return createdUser;
    },
    
    async getUser(id: string): Promise<User | null> {
      return await db.query.user.findFirst({
        where: eq(user.id, id),
      });
    },
    
    async getUserByEmail(email: string): Promise<User | null> {
      return await db.query.user.findFirst({
        where: eq(user.email, email),
      });
    },
    
    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }): Promise<User | null> {
      const result = await db.query.account.findFirst({
        where: and(
          eq(account.provider, provider),
          eq(account.providerAccountId, providerAccountId)
        ),
        with: {
          user: true,
        },
      });
      
      return result?.user ?? null;
    },
    
    async updateUser(data: User): Promise<User | null> {
      await db.update(user)
        .set({
          name: data.name,
          email: data.email,
          emailVerified: data.emailVerified,
          image: data.image,
        })
        .where(eq(user.id, data.id));
        
      return await db.query.user.findFirst({
        where: eq(user.id, data.id),
      });
    },
    
    async deleteUser(userId: string): Promise<void> {
      await db.delete(user).where(eq(user.id, userId));
    },
    
    async linkAccount(data: Account): Promise<void> {
      await db.insert(account).values({
        id: nanoid(),
        userId: data.userId,
        type: data.type,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
        refresh_token: data.refresh_token,
        access_token: data.access_token,
        expires_at: data.expires_at,
        token_type: data.token_type,
        scope: data.scope,
        id_token: data.id_token,
        session_state: data.session_state,
      });
    },
    
    async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }): Promise<void> {
      await db.delete(account).where(
        and(
          eq(account.provider, provider),
          eq(account.providerAccountId, providerAccountId)
        )
      );
    },
    
    async createSession(data: Session): Promise<Session | null> {
      await db.insert(session).values({
        id: nanoid(),
        userId: data.userId,
        expires: data.expires,
        sessionToken: data.sessionToken,
      });
      
      return await db.query.session.findFirst({
        where: eq(session.sessionToken, data.sessionToken),
      });
    },
    
    async getSessionAndUser(sessionToken: string): Promise<{ session: Session; user: User } | null> {
      const userSession = await db.query.session.findFirst({
        where: eq(session.sessionToken, sessionToken),
        with: {
          user: true,
        },
      });
      
      if (!userSession) return null;
      
      const { user: sessionUser, ...sessionData } = userSession;
      
      return {
        session: sessionData,
        user: sessionUser,
      };
    },
    
    async updateSession(data: Session): Promise<Session | null> {
      await db.update(session)
        .set({ expires: data.expires })
        .where(eq(session.sessionToken, data.sessionToken));
        
      return await db.query.session.findFirst({
        where: eq(session.sessionToken, data.sessionToken),
      });
    },
    
    async deleteSession(sessionToken: string): Promise<void> {
      await db.delete(session).where(eq(session.sessionToken, sessionToken));
    },
    
    async createVerificationToken(data: VerificationToken): Promise<VerificationToken | null> {
      await db.insert(verificationToken).values({
        identifier: data.identifier,
        token: data.token,
        expires: data.expires,
      });
      
      return await db.query.verificationToken.findFirst({
        where: and(
          eq(verificationToken.identifier, data.identifier),
          eq(verificationToken.token, data.token)
        ),
      });
    },
    
    async useVerificationToken(data: VerificationToken): Promise<VerificationToken | null> {
      const token = await db.query.verificationToken.findFirst({
        where: and(
          eq(verificationToken.identifier, data.identifier),
          eq(verificationToken.token, data.token)
        ),
      });
      
      if (!token) return null;
      
      await db.delete(verificationToken).where(
        and(
          eq(verificationToken.identifier, data.identifier),
          eq(verificationToken.token, data.token)
        )
      );
      
      return token;
    },
  };
} 