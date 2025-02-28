import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as fs from 'fs';

// Load environment variables from appropriate files
if (process.env.NODE_ENV === 'production') {
  // Try to load from .env first, then fallback to .env.local if it exists
  config();
  if (fs.existsSync('.env.local')) {
    config({ path: '.env.local', override: false });
  }
} else {
  // For local development, prioritize .env.local
  config({ path: '.env.local' });
}

const runMigrate = async () => {
  // Check for both POSTGRES_URL and DATABASE_URL to support different environment configurations
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('Environment variables available:', Object.keys(process.env).filter(key => 
      !key.includes('KEY') && !key.includes('SECRET') && !key.includes('TOKEN')
    ));
    throw new Error('Database URL is not defined. Please set POSTGRES_URL or DATABASE_URL in your environment');
  }

  console.log('⏳ Running migrations with database URL:', dbUrl.replace(/:[^:]*@/, ':****@')); // Mask password
  
  try {
    const connection = postgres(dbUrl, { 
      max: 1,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    });
    
    const db = drizzle(connection);

    const start = Date.now();
    await migrate(db, { migrationsFolder: './lib/db/migrations' });
    const end = Date.now();

    console.log('✅ Migrations completed in', end - start, 'ms');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed');
    console.error(error);
    process.exit(1);
  }
};

runMigrate();
