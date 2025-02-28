// types.ts
export interface User {
    id: string;
    email: string;
    name?: string;
    emailVerified?: Date | null;
    image?: string;
  }
  
  export interface Account {
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
  }
  
  export interface Session {
    id: string;
    userId: string;
    expires: Date;
    sessionToken: string;
  }
  
  export interface VerificationToken {
    identifier: string;
    token: string;
    expires: Date;
  }