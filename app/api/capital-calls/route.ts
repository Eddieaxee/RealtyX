import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Fetch payouts (capital calls) for properties the user has invested in
    const investments = await prisma.investment.findMany({
      where: { userId: session.user.id },
      select: { propertyId: true },
    });

    const propertyIds = investments.map((inv) => inv.propertyId);

    const payouts = await prisma.payout.findMany({
      where: { propertyId: { in: propertyIds } },
      include: { property: true },
      orderBy: { createdAt: "desc" },
    });

    // Fetch user distributions separately
    const userDistributions = await prisma.distribution.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Calculate summary stats
    const totalDistributed = payouts
      .filter(
        (p: { status: string; amountNGN: number | null }) =>
          p.status === "DISTRIBUTED",
      )
      .reduce(
        (sum: number, p: { amountNGN: number | null }) =>
          sum + Number(p.amountNGN || 0),
        0,
      );

    const pendingAmount = payouts
      .filter(
        (p: { status: string; amountNGN: number | null }) =>
          p.status === "PENDING",
      )
      .reduce(
        (sum: number, p: { amountNGN: number | null }) =>
          sum + Number(p.amountNGN || 0),
        0,
      );

    const totalUserReceived = userDistributions
      .filter((d: { distributedAt: Date | null }) => d.distributedAt)
      .reduce(
        (sum: number, d: { amountNGN: number | null }) =>
          sum + Number(d.amountNGN || 0),
        0,
      );

    return NextResponse.json({
      payouts,
      distributions: userDistributions,
      summary: {
        totalDistributed,
        pendingAmount,
        totalUserReceived,
        payoutCount: payouts.length,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch capital calls" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { propertyId, amountUSD, amountNGN, type, periodStart, periodEnd } =
      body;

    // Create a new payout (capital call)
    const payout = await prisma.payout.create({
      data: {
        propertyId,
        amountUSD,
        amountNGN,
        type: type || "RENTAL",
        periodStart: periodStart ? new Date(periodStart) : null,
        periodEnd: periodEnd ? new Date(periodEnd) : null,
        status: "PENDING",
      },
      include: { property: true },
    });

    // Create distributions for all investors of this property
    const investments = await prisma.investment.findMany({
      where: { propertyId, status: "CONFIRMED" },
    });

    const totalTokens = investments.reduce(
      (sum: number, inv: { tokens: number }) => sum + inv.tokens,
      0,
    );

    for (const investment of investments) {
      const shareRatio = investment.tokens / totalTokens;
      await prisma.distribution.create({
        data: {
          payoutId: payout.id,
          propertyId,
          userId: investment.userId,
          amountUSD: Number(amountUSD) * shareRatio,
          amountNGN: Number(amountNGN) * shareRatio,
          tokens: investment.tokens,
          type: "DIVIDEND",
          totalAmount: Number(amountUSD) * shareRatio,
          perToken: Number(amountUSD) / totalTokens,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json(payout);
  } catch {
    return NextResponse.json(
      { error: "Failed to create capital call" },
      { status: 500 },
    );
  }
}
