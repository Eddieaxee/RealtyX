import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    // This is where Prisma 7 reads your database URL for migrations and CLI tasks
    url: env("DATABASE_URL"),
  },
});
