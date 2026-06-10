import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "CRITICAL_CONFIG_ERROR: DATABASE_URL environment variable is missing.",
    );
  }

  // Production-grade pooling wrapper using stable native Prisma mechanisms with Accelerate edge optimization
  return new PrismaClient({
    accelerateUrl: process.env.PRISMA_ORM,
  }).$extends(withAccelerate());
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
