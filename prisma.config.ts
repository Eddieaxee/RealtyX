import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    // ✓ Use process.env directly so it doesn't throw a fatal crash if missing during builds
    url: process.env.DATABASE_URL || "postgres://placeholder_for_build_steps",
  },
});
