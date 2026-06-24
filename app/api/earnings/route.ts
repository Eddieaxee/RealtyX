import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Fetch all distributions (earnings) for the user
    const distributions = await prisma.distribution.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Fetch investments for context
    const investments = await prisma.investment.findMany({
      where: { userId: session.user.id, status: "CONFIRMED" },
    });

    // Fetch properties for the investments
    const propertyIds = Array.from(
      new Set(investments.map((inv) => inv.propertyId)),
    );
    const properties = await prisma.property.findMany({
      where: { id: { in: propertyIds } },
    });
    const propertyMap = new Map(properties.map((p) => [p.id, p]));

    // Calculate earnings summary
    const totalEarnedUSD = distributions
      .filter((d: { distributedAt: Date | null }) => d.distributedAt)
      .reduce((sum: number, d: { amountUSD: number | null }) => sum + Number(d.amountUSD || 0), 0);

    const totalEarnedNGN = distributions
      .filter((d: { distributedAt: Date | null }) => d.distributedAt)
      .reduce((sum: number, d: { amountNGN: number | null }) => sum + Number(d.amountNGN || 0), 0);

    const pendingEarningsUSD = distributions
      .filter((d: { distributedAt: Date | null }) => !d.distributedAt)
      .reduce((sum: number, d: { amountUSD: number | null }) => sum + Number(d.amountUSD || 0), 0);

    const pendingEarningsNGN = distributions
      .filter((d: { distributedAt: Date | null }) => !d.distributedAt)
      .reduce((sum: number, d: { amountNGN: number | null }) => sum + Number(d.amountNGN || 0), 0);

    // Monthly earnings breakdown
    const monthlyEarnings: Record<string, { usd: number; ngn: number }> = {};
    distributions
      .filter((d) => d.distributedAt)
      .forEach((d) => {
        const month = new Date(d.distributedAt!).toISOString().slice(0, 7);
        if (!monthlyEarnings[month]) {
          monthlyEarnings[month] = { usd: 0, ngn: 0 };
        }
        monthlyEarnings[month].usd += Number(d.amountUSD || 0);
        monthlyEarnings[month].ngn += Number(d.amountNGN || 0);
      });

    // Earnings by property
    const earningsByProperty: Record<
      string,
      { title: string; usd: number; ngn: number; tokens: number }
    > = {};
    for (const investment of investments) {
      const propertyId = investment.propertyId;
      if (!earningsByProperty[propertyId]) {
        const prop = propertyMap.get(propertyId);
        earningsByProperty[propertyId] = {
          title: prop?.title || "Unknown Property",
          usd: 0,
          ngn: 0,
          tokens: investment.tokens,
        };
      }
    }

    // Populate earnings by property from distributions
    for (const dist of distributions) {
      if (!dist.distributedAt) continue;
      // Find the investment that matches this distribution's tokens
      const matchingInv = investments.find(
        (i) => i.propertyId && earningsByProperty[i.propertyId],
      );
      if (matchingInv && earningsByProperty[matchingInv.propertyId]) {
        earningsByProperty[matchingInv.propertyId].usd += Number(
          dist.amountUSD || 0,
        );
        earningsByProperty[matchingInv.propertyId].ngn += Number(
          dist.amountNGN || 0,
        );
      }
    }

    // Build investments with property data
    const investmentsWithProperties = investments.map((inv) => ({
      ...inv,
      property: propertyMap.get(inv.propertyId) || null,
    }));

    return NextResponse.json({
      distributions,
      investments: investmentsWithProperties,
      summary: {
        totalEarnedUSD,
        totalEarnedNGN,
        pendingEarningsUSD,
        pendingEarningsNGN,
        distributionCount: distributions.length,
        investmentCount: investments.length,
      },
      monthlyEarnings: Object.entries(monthlyEarnings)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([month, data]) => ({ month, ...data })),
      earningsByProperty: Object.values(earningsByProperty),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch earnings" },
      { status: 500 },
    );
  }
}