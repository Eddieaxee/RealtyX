import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";

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

  // Nigerian-first property listings - real locations across Nigeria
  const properties = await prisma.property.createMany({
    data: [
      {
        title: "Ikoyi Luxury Penthouse",
        description:
          "Premium waterfront penthouse in the heart of Ikoyi, Lagos. Features panoramic views of Lagos Lagoon, private elevator access, and world-class amenities. Located in one of Africa's most prestigious addresses.",
        slug: "ikoyi-luxury-penthouse",
        type: "RESIDENTIAL",
        status: "ACTIVE",
        developmentStatus: "EXISTING_STRUCTURE",
        completionPercentage: 100,
        location: "Ikoyi, Lagos",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        latitude: 6.4541,
        longitude: 3.4264,
        totalValueUSD: 850000,
        totalValueNGN: 1292000000,
        tokenPriceUSD: 100,
        tokenPriceNGN: 152000,
        totalTokens: 8500,
        availableTokens: 4200,
        minInvestmentUSD: 100,
        expectedReturn: 14.2,
        rentalYield: 8.5,
        images: [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        ],
        documents: [],
        features: [
          "Swimming Pool",
          "Gym",
          "24/7 Security",
          "Parking",
          "CCTV",
          "Backup Power",
        ],
        publishedAt: new Date(),
      },
      {
        title: "Victoria Island Commercial Tower",
        description:
          "Grade A office space in Victoria Island's central business district. Home to multinational corporations and financial institutions. Triple-net lease structure with guaranteed occupancy.",
        slug: "victoria-island-commercial-tower",
        type: "COMMERCIAL",
        status: "ACTIVE",
        developmentStatus: "EXISTING_STRUCTURE",
        completionPercentage: 100,
        location: "Victoria Island, Lagos",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        latitude: 6.4281,
        longitude: 3.4219,
        totalValueUSD: 3200000,
        totalValueNGN: 4864000000,
        tokenPriceUSD: 50,
        tokenPriceNGN: 76000,
        totalTokens: 64000,
        availableTokens: 18000,
        minInvestmentUSD: 50,
        expectedReturn: 18.5,
        rentalYield: 12.3,
        images: [
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        ],
        documents: [],
        features: [
          "Elevator",
          "Backup Power",
          "Conference Rooms",
          "Parking",
          "Security",
        ],
        publishedAt: new Date(),
      },
      {
        title: "Lekki Phase 1 Estate",
        description:
          "Modern residential estate in Lekki Phase 1 featuring detached and semi-detached homes. Gated community with underground utilities, recreational facilities, and proximity to the Lekki Free Trade Zone.",
        slug: "lekki-phase-1-estate",
        type: "RESIDENTIAL",
        status: "ACTIVE",
        developmentStatus: "UNDER_CONSTRUCTION",
        completionPercentage: 72,
        location: "Lekki Phase 1, Lagos",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        latitude: 6.4475,
        longitude: 3.4713,
        totalValueUSD: 1800000,
        totalValueNGN: 2736000000,
        tokenPriceUSD: 75,
        tokenPriceNGN: 114000,
        totalTokens: 24000,
        availableTokens: 9500,
        minInvestmentUSD: 75,
        expectedReturn: 22.0,
        rentalYield: 10.5,
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        ],
        documents: [],
        features: [
          "Gated Estate",
          "Recreational Center",
          "Water Treatment",
          "Street Lights",
          "Green Areas",
        ],
        publishedAt: new Date(),
      },
      {
        title: "Abuja Maitama Duplex",
        description:
          "Exclusive duplex in Maitama, Abuja's most affluent neighborhood. Walking distance to embassies and government institutions. High-security area with excellent infrastructure.",
        slug: "abuja-maitama-duplex",
        type: "RESIDENTIAL",
        status: "ACTIVE",
        developmentStatus: "EXISTING_STRUCTURE",
        completionPercentage: 100,
        location: "Maitama, Abuja",
        city: "Abuja",
        state: "FCT",
        country: "Nigeria",
        latitude: 9.0765,
        longitude: 7.4906,
        totalValueUSD: 1200000,
        totalValueNGN: 1824000000,
        tokenPriceUSD: 120,
        tokenPriceNGN: 182400,
        totalTokens: 10000,
        availableTokens: 3500,
        minInvestmentUSD: 120,
        expectedReturn: 16.0,
        rentalYield: 9.0,
        images: [
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        ],
        documents: [],
        features: [
          "Smart Home",
          "Garden",
          "Boys Quarters",
          "Solar Power",
          "High Security",
        ],
        publishedAt: new Date(),
      },
      {
        title: "Port Harcourt Shopping Mall",
        description:
          "Prime retail and entertainment complex in Port Harcourt's commercial corridor. Anchor tenants include leading Nigerian and international brands. Triple-net lease with inflation-adjusted rent escalations.",
        slug: "port-harcourt-shopping-mall",
        type: "RETAIL",
        status: "ACTIVE",
        developmentStatus: "PHASED_DEVELOPMENT",
        completionPercentage: 85,
        location: "Port Harcourt, Rivers",
        city: "Port Harcourt",
        state: "Rivers",
        country: "Nigeria",
        latitude: 4.8156,
        longitude: 7.0498,
        totalValueUSD: 5400000,
        totalValueNGN: 8208000000,
        tokenPriceUSD: 75,
        tokenPriceNGN: 114000,
        totalTokens: 72000,
        availableTokens: 25000,
        minInvestmentUSD: 75,
        expectedReturn: 20.0,
        rentalYield: 14.0,
        images: [
          "https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800&q=80",
        ],
        documents: [],
        features: [
          "Anchor Tenants",
          "Food Court",
          "Cinema",
          "Parking Lot",
          "Loading Bay",
        ],
        publishedAt: new Date(),
      },
      {
        title: "Ikoyi Serviced Apartments",
        description:
          "Fully serviced luxury apartments in Ikoyi targeting the expatriate and short-let market. Managed by a professional hospitality operator with guaranteed minimum occupancy and revenue sharing.",
        slug: "ikoyi-serviced-apartments",
        type: "HOSPITALITY",
        status: "ACTIVE",
        developmentStatus: "EXISTING_STRUCTURE",
        completionPercentage: 100,
        location: "Ikoyi, Lagos",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        latitude: 6.4415,
        longitude: 3.4205,
        totalValueUSD: 2100000,
        totalValueNGN: 3192000000,
        tokenPriceUSD: 60,
        tokenPriceNGN: 91200,
        totalTokens: 35000,
        availableTokens: 12000,
        minInvestmentUSD: 60,
        expectedReturn: 17.5,
        rentalYield: 13.2,
        images: [
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        ],
        documents: [],
        features: [
          "Fully Furnished",
          "Concierge",
          "Pool",
          "Restaurant",
          "Airport Shuttle",
        ],
        publishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  // Create sample KYC records for the user
  await prisma.kYCRecord.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      status: "PENDING",
      firstName: "John",
      lastName: "Doe",
      nationality: "Nigerian",
      idType: "BVN",
      country: "Nigeria",
      state: "Lagos",
      investmentGoals: ["WEALTH_BUILDING", "PASSIVE_INCOME"],
    },
  });

  // Create sample wallet for the user
  await prisma.wallet.create({
    data: {
      userId: user.id,
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
      chainId: 137,
      chain: "Polygon",
      type: "EOA",
      isPrimary: true,
      isVerified: true,
      verifiedAt: new Date(),
      balance: 0,
    },
  });

  console.log("Database seeded successfully:");
  console.log(`  Admin: ${admin.email}`);
  console.log(`  User: ${user.email}`);
  console.log(`  Properties: ${properties.count} created`);
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
