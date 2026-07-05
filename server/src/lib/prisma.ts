import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

export const runWithPrisma = async <T>(operation: () => Promise<T>, fallback: () => Promise<T> | T): Promise<T> => {
  if (!isDatabaseConfigured) {
    return await fallback();
  }

  try {
    return await operation();
  } catch (error) {
    console.warn('Prisma unavailable, falling back to in-memory store:', error instanceof Error ? error.message : error);
    return await fallback();
  }
};
