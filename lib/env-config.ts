// Environment configuration for AWS deployment
export function getEnvConfig() {
  // For local development
  if (process.env.NODE_ENV !== 'production') {
    return {
      databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/chatbot',
      nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      nextAuthSecret: process.env.NEXTAUTH_SECRET || 'local-dev-secret',
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    };
  }
  
  // For AWS production environment
  return {
    // Constructed database URL using AWS RDS endpoint from secrets
    databaseUrl: process.env.DATABASE_URL,
    nextAuthUrl: process.env.NEXT_PUBLIC_WEB_URL || 'https://your-domain.com',
    nextAuthSecret: process.env.AUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  };
} 