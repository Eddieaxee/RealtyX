import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  // For local SQLite (file:./dev.db), use better-sqlite3 adapter
  const isLocal = !process.env.PRISMA_ORM || process.env.DATABASE_URL?.startsWith("file:");
  
  if (isLocal) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
    return new PrismaClient({ adapter, log: ["error"] });
  }

  // Production: use Accelerate
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { withAccelerate } = require("@prisma/extension-accelerate");
  return new PrismaClient({
    accelerateUrl: process.env.PRISMA_ORM,
  }).$extends(withAccelerate());
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
