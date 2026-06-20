import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  // Create admin user
  const admin = await db.user.upsert({
    where: { email: "admin@realtyx.io" },
    update: {},
    create: {
      email: "admin@realtyx.io",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
      twoFactorEnabled: false,
    },
  });

  // Create regular user
  const user = await db.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "John Doe",
      password: userPassword,
      role: "USER",
      status: "ACTIVE",
      twoFactorEnabled: false,
    },
  });

  // Create profiles
  await db.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      firstName: "Admin",
      lastName: "User",
      phone: "+234801234567",
      country: "Nigeria",
      city: "Lagos",
    },
  });

  await db.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      firstName: "John",
      lastName: "Doe",
      phone: "+234808765432",
      country: "Nigeria",
      city: "Lagos",
    },
  });

  // Create user settings
  await db.userSettings.upsert({
    where: { userId: admin.id },
    update: {},
    create: { userId: admin.id },
  });

  await db.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  // Create wallets
  await db.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      balanceUSD: 0,
      balanceNGN: 0,
      totalInvested: 0,
      totalReturns: 0,
      totalWithdrawn: 0,
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
    },
  });

  await db.wallet.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      balanceUSD: 0,
      balanceNGN: 0,
      totalInvested: 0,
      totalReturns: 0,
      totalWithdrawn: 0,
      walletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    },
  });

  // Nigerian-first property listings - real locations across Nigeria
  const properties = await db.property.createMany({
    data: [
      {
        title: "Ikoyi Luxury Penthouse",
        description:
          "Premium waterfront penthouse in the heart of Ikoyi, Lagos. Features panoramic views of Lagos Lagoon, private elevator access, and world-class amenities. Located in one of Africa's most prestigious addresses.",
        slug: "ikoyi-luxury-penthouse",
        type: "RESIDENTIAL",
        status: "AVAILABLE",
        developmentStatus: "COMPLETED",
        completionPercentage: 100,
        location: "Ikoyi, Lagos",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        lat: 6.4541,
        lng: 3.4264,
        priceUSD: 850000,
        priceNGN: 1292000000,
        totalTokens: 8500,
        availableTokens: 4200,
        tokenPriceUSD: 100,
        tokenPriceNGN: 152000,
        expectedReturn: 14.2,
        rentalYield: 8.5,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Swimming Pool",
          "Gym",
          "24/7 Security",
          "Parking",
          "CCTV",
          "Backup Power",
        ]),
        documents: JSON.stringify([]),
        occupancyRate: 95,
        netOperatingIncome: 72250,
        appreciationRate: 8.5,
      },
      {
        title: "Victoria Island Commercial Tower",
        description:
          "Grade A office space in Victoria Island's central business district. Home to multinational corporations and financial institutions. Triple-net lease structure with guaranteed occupancy.",
        slug: "victoria-island-commercial-tower",
        type: "COMMERCIAL",
        status: "AVAILABLE",
        developmentStatus: "COMPLETED",
        completionPercentage: 100,
        location: "Victoria Island, Lagos",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        lat: 6.4281,
        lng: 3.4219,
        priceUSD: 3200000,
        priceNGN: 4864000000,
        totalTokens: 64000,
        availableTokens: 18000,
        tokenPriceUSD: 50,
        tokenPriceNGN: 76000,
        expectedReturn: 18.5,
        rentalYield: 12.3,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Elevator",
          "Backup Power",
          "Conference Rooms",
          "Parking",
          "Security",
        ]),
        documents: JSON.stringify([]),
        occupancyRate: 98,
        netOperatingIncome: 393600,
        appreciationRate: 10.2,
      },
      {
        title: "Lekki Phase 1 Estate",
        description:
          "Modern residential estate in Lekki Phase 1 featuring detached and semi-detached homes. Gated community with underground utilities, recreational facilities, and proximity to the Lekki Free Trade Zone.",
        slug: "lekki-phase-1-estate",
        type: "RESIDENTIAL",
        status: "AVAILABLE",
        developmentStatus: "UNDER_CONSTRUCTION",
        completionPercentage: 72,
        location: "Lekki Phase 1, Lagos",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        lat: 6.4475,
        lng: 3.4713,
        priceUSD: 1800000,
        priceNGN: 2736000000,
        totalTokens: 24000,
        availableTokens: 9500,
        tokenPriceUSD: 75,
        tokenPriceNGN: 114000,
        expectedReturn: 22.0,
        rentalYield: 10.5,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Gated Estate",
          "Recreational Center",
          "Water Treatment",
          "Street Lights",
          "Green Areas",
        ]),
        documents: JSON.stringify([]),
        occupancyRate: 0,
        netOperatingIncome: 0,
        appreciationRate: 12.0,
      },
      {
        title: "Abuja Maitama Duplex",
        description:
          "Exclusive duplex in Maitama, Abuja's most affluent neighborhood. Walking distance to embassies and government institutions. High-security area with excellent infrastructure.",
        slug: "abuja-maitama-duplex",
        type: "RESIDENTIAL",
        status: "AVAILABLE",
        developmentStatus: "COMPLETED",
        completionPercentage: 100,
        location: "Maitama, Abuja",
        city: "Abuja",
        state: "FCT",
        country: "Nigeria",
        lat: 9.0765,
        lng: 7.4906,
        priceUSD: 1200000,
        priceNGN: 1824000000,
        totalTokens: 10000,
        availableTokens: 3500,
        tokenPriceUSD: 120,
        tokenPriceNGN: 182400,
        expectedReturn: 16.0,
        rentalYield: 9.0,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Smart Home",
          "Garden",
          "Boys Quarters",
          "Solar Power",
          "High Security",
        ]),
        documents: JSON.stringify([]),
        occupancyRate: 100,
        netOperatingIncome: 108000,
        appreciationRate: 9.5,
      },
      {
        title: "Port Harcourt Shopping Mall",
        description:
          "Prime retail and entertainment complex in Port Harcourt's commercial corridor. Anchor tenants include leading Nigerian and international brands. Triple-net lease with inflation-adjusted rent escalations.",
        slug: "port-harcourt-shopping-mall",
        type: "RETAIL",
        status: "AVAILABLE",
        developmentStatus: "UNDER_CONSTRUCTION",
        completionPercentage: 85,
        location: "Port Harcourt, Rivers",
        city: "Port Harcourt",
        state: "Rivers",
        country: "Nigeria",
        lat: 4.8156,
        lng: 7.0498,
        priceUSD: 5400000,
        priceNGN: 8208000000,
        totalTokens: 72000,
        availableTokens: 25000,
        tokenPriceUSD: 75,
        tokenPriceNGN: 114000,
        expectedReturn: 20.0,
        rentalYield: 14.0,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Anchor Tenants",
          "Food Court",
          "Cinema",
          "Parking Lot",
          "Loading Bay",
        ]),
        documents: JSON.stringify([]),
        occupancyRate: 85,
        netOperatingIncome: 756000,
        appreciationRate: 11.0,
      },
      {
        title: "Ikoyi Serviced Apartments",
        description:
          "Fully serviced luxury apartments in Ikoyi targeting the expatriate and short-let market. Managed by a professional hospitality operator with guaranteed minimum occupancy and revenue sharing.",
        slug: "ikoyi-serviced-apartments",
        type: "HOSPITALITY",
        status: "AVAILABLE",
        developmentStatus: "COMPLETED",
        completionPercentage: 100,
        location: "Ikoyi, Lagos",
        city: "Lagos",
        state: "Lagos",
        country: "Nigeria",
        lat: 6.4415,
        lng: 3.4205,
        priceUSD: 2100000,
        priceNGN: 3192000000,
        totalTokens: 35000,
        availableTokens: 12000,
        tokenPriceUSD: 60,
        tokenPriceNGN: 91200,
        expectedReturn: 17.5,
        rentalYield: 13.2,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        ]),
        features: JSON.stringify([
          "Fully Furnished",
          "Concierge",
          "Pool",
          "Restaurant",
          "Airport Shuttle",
        ]),
        documents: JSON.stringify([]),
        occupancyRate: 92,
        netOperatingIncome: 277200,
        appreciationRate: 9.8,
      },
    ],
  });

  // Create sample KYC record for the user
  await db.kyc.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      status: "PENDING",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+234808765432",
      address: "15 Admiralty Way, Lekki Phase 1",
      country: "Nigeria",
      idType: "DRIVERS_LICENSE",
      idNumber: "DL12345678901",
    },
  });

  console.log("Database seeded successfully:");
  console.log(`  Admin: ${admin.email} (password: admin123)`);
  console.log(`  User: ${user.email} (password: user123)`);
  console.log(`  Properties: ${properties.count} created`);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });