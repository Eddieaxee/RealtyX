import { Prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { }

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@realtyx.io" },
    update: {},
    create: {
      email: "admin@realtyx.io",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "John Doe",
      password: userPassword,
      role: "USER",
      status: "ACTIVE",
    },
  });

  const properties = await prisma.property.createMany({
    data: [
      {
        title: "Luxury Manhattan Penthouse",
        description: "Premium penthouse in the heart of Manhattan with stunning city views.",
        slug: "luxury-manhattan-penthouse",
        type: "RESIDENTIAL",
        status: "ACTIVE",
        location: "Upper East Side, Manhattan",
        city: "New York",
        country: "USA",
        totalValue: 8500000,
        tokenPrice: 100,
        totalTokens: 85000,
        availableTokens: 4200,
        minInvestment: 100,
        expectedReturn: 14.2,
        rentalYield: 8.5,
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"],
        features: ["Pool", "Gym", "Concierge", "Parking"],
      },
      {
        title: "Miami Beachfront Villa",
        description: "Stunning beachfront property with private access and ocean views.",
        slug: "miami-beachfront-villa",
        type: "RESIDENTIAL",
        status: "ACTIVE",
        location: "South Beach, Miami",
        city: "Miami",
        country: "USA",
        totalValue: 3200000,
        tokenPrice: 50,
        totalTokens: 64000,
        availableTokens: 18000,
        minInvestment: 50,
        expectedReturn: 18.5,
        rentalYield: 12.3,
        images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"],
        features: ["Beach Access", "Pool", "Garden", "Security"],
      },
      {
        title: "Berlin Tech District Office",
        description: "Modern office space in Berlins thriving tech district.",
        slug: "berlin-tech-district-office",
        type: "COMMERCIAL",
        status: "ACTIVE",
        location: "Mitte, Berlin",
        city: "Berlin",
        country: "Germany",
        totalValue: 5400000,
        tokenPrice: 75,
        totalTokens: 72000,
        availableTokens: 9500,
        minInvestment: 75,
        expectedReturn: 11.8,
        rentalYield: 7.2,
        images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"],
        features: ["Parking", "Conference Rooms", "Cafeteria", "Gym"],
      },
    ],
    skipDuplicates: true,
  });

  console.log({ admin, user, properties });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
