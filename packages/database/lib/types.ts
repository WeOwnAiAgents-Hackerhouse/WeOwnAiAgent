export interface Document {
  id: string;
  title: string;
  content: string;
  kind: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
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

export interface Suggestion {
  id: string;
  documentId: string;
  content: string;
  createdAt: Date;
} 