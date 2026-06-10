import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");

    const where: Record<string, unknown> = {
      status: { in: ["OPEN", "PARTIALLY_FILLED"] },
    };
    if (propertyId) {
      where.propertyId = propertyId;
    }

    type SecondaryMarketOrderRow = {
      id: string;
      userId: string;
      propertyId: string;
      type: "BUY" | "SELL";
      priceUSD: string | number | null;
      priceNGN: string | number;
      quantity: number;
      status: "OPEN" | "PARTIALLY_FILLED" | "FILLED";
      createdAt: Date | string;
      updatedAt: Date | string;
      property?: { title?: string | null } | null;
    };

    type SecondaryMarketOrderWithProperty = SecondaryMarketOrderRow & {
      property: { title: string | null } | null;
    };

    // Prisma client typing differs across generator versions; keep runtime shape strict without using `any`
    const orders = (
      prisma as unknown as {
        secondaryMarketOrder: {
          findMany: (
            args: unknown,
          ) => Promise<SecondaryMarketOrderWithProperty[]>;
        };
      }
    ).secondaryMarketOrder.findMany({
      where,
      include: { property: true },
      orderBy: { createdAt: "desc" },
    });

    const ordersResolved = await orders;

    // Build order book (bids and asks)
    const bids = ordersResolved
      .filter((o) => o.type === "BUY")
      .sort((a, b) => Number(b.priceNGN) - Number(a.priceNGN));

    const asks = ordersResolved
      .filter((o) => o.type === "SELL")
      .sort((a, b) => Number(a.priceNGN) - Number(b.priceNGN));

    // Calculate 24h volume
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentOrders = ordersResolved.filter(
      (o) =>
        new Date(o.createdAt) >= twentyFourHoursAgo && o.status === "FILLED",
    );
    const volume24h = recentOrders.reduce(
      (sum, o) => sum + Number(o.priceNGN) * o.quantity,
      0,
    );

    // Last traded price
    const filledOrders = ordersResolved
      .filter((o) => o.status === "FILLED")
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
    const lastPrice =
      filledOrders.length > 0 ? Number(filledOrders[0].priceNGN) : 0;

    return NextResponse.json({
      orders,
      orderBook: { bids, asks },
      volume24h,
      lastPrice,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch secondary market data" },
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
    const { propertyId, type, priceUSD, priceNGN, quantity, expiresAt } = body;

    // Validate the user has enough tokens for a sell order
    if (type === "SELL") {
      const investment = await prisma.investment.findFirst({
        where: {
          userId: session.user.id,
          propertyId,
          status: "CONFIRMED",
        },
      });
      if (!investment || investment.tokens < quantity) {
        return NextResponse.json(
          { error: "Insufficient tokens for sell order" },
          { status: 400 },
        );
      }
    }

    const order = await (
      prisma as unknown as {
        secondaryMarketOrder: {
          create: (args: unknown) => Promise<unknown>;
        };
      }
    ).secondaryMarketOrder.create({
      data: {
        userId: session.user.id,
        propertyId,
        type,
        priceUSD,
        priceNGN,
        quantity,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        status: "OPEN",
      },
      include: { property: true },
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
