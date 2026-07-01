import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Singleton Prisma Client instance for Prisma 7.
 * Prevents multiple connection pools during hot-reloads in development.
 * Automatically wraps connections with the appropriate runtime driver adapter.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString =
  process.env.DATABASE_URL || "postgres://placeholder_key_for_build_steps";

// Initialize the native PostgreSQL pool driver
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

export const prisma = db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
