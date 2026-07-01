import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString =
  process.env.DATABASE_URL || "postgres://placeholder_key_for_build_steps";

// ✓ In Prisma 7, pass the connectionString options directly into PrismaPg
const adapter = new PrismaPg({
  connectionString,
});

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

export const prisma = db;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
