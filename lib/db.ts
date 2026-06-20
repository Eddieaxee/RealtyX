import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Singleton Prisma Client instance.
 * Prevents multiple connection pools during hot-reload in development.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });

export const db =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

export const prisma = db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
