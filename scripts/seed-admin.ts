import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

async function main() {
  const sqlite = new Database("prisma/dev.db");
  const adapter = new PrismaBetterSqlite3(sqlite);
  const prisma = new PrismaClient({ adapter });

  // Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@realtyx.io" },
    update: {},
    create: {
      email: "admin@realtyx.io",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "John Investor",
      password: userPassword,
      role: "USER",
      status: "ACTIVE",
    },
  });
  console.log("✅ User created:", user.email);

  await prisma.$disconnect();
  console.log("\n🎉 Seeding complete!");
  console.log("\n📧 Admin login: admin@realtyx.io / admin123");
  console.log("📧 User login: user@example.com / user123");
  console.log("\n🔗 Sign in at: http://localhost:3000/auth/signin");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});