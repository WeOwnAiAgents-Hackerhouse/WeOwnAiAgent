import { PrismaClient } from '@prisma/client';

// AWS-aware configuration with connection pooling
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // Add connection pooling for AWS RDS
    // These values help optimize for container environments
    __internal: {
      engine: {
        connectionPoolSize: 5, // Adjust based on your workload
      }
    }
  });
};

// Define global for PrismaClient - prevents multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Handle graceful shutdown for AWS container environments
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma; 