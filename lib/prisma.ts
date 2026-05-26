import { PrismaClient } from "./generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;
const globalForPrisma = global as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

const createPrismaClient = () => {
  const accelerateUrl = process.env.DATABASE_URL;
  if (!accelerateUrl) {
    throw new Error("DATABASE_URL must be set for Prisma accelerate");
  }
  return new PrismaClient({
    accelerateUrl,
  }).$extends(withAccelerate());
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
