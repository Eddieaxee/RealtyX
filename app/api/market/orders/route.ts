import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkKycForTransaction } from "@/lib/kyc-guard";

/**
 * Market Orders API
 * - GET: List open market orders (public)
 * - POST: Create a new sell order (authenticated, KYC verified)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get("propertyId");
  const sellerId = searchParams.get("sellerId");
  const status = searchParams.get("status") || "OPEN";

  try {
    const where: Record<string, unknown> = { status };

    if (propertyId) where.propertyId = propertyId;
    if (sellerId) where.sellerId = sellerId;

    const orders = await db.marketOrder.findMany({
      where,
      include: {
        seller: {
          select: { id: true, name: true },
        },
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            images: true,
            location: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Parse images JSON for each order's property
    const parsed = orders.map((order) => ({
      ...order,
      property: {
        ...order.property,
        images: (() => {
          try {
            const parsed = JSON.parse(order.property.images || "[]");
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })(),
      },
    }));

    return NextResponse.json({ success: true, orders: parsed });
  } catch (error) {
    console.error("Failed to fetch market orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { propertyId, tokenCount, pricePerTokenUSD } = await req.json();

    if (!propertyId || !tokenCount || !pricePerTokenUSD) {
      return NextResponse.json(
        { error: "propertyId, tokenCount, and pricePerTokenUSD are required" },
        { status: 400 }
      );
    }

    if (tokenCount <= 0 || pricePerTokenUSD <= 0) {
      return NextResponse.json(
        { error: "Token count and price must be positive" },
        { status: 400 }
      );
    }

    // KYC check
    const kycResult = await checkKycForTransaction(session.user.id, "SALE");
    if (!kycResult.allowed) {
      return NextResponse.json(
        { error: kycResult.reason, kycStatus: kycResult.kycStatus },
        { status: 403 }
      );
    }

    // Verify seller actually owns enough tokens
    const holding = await db.assetHolding.findUnique({
      where: {
        userId_propertyId: {
          userId: session.user.id,
          propertyId,
        },
      },
    });

    if (!holding || holding.tokenBalance < tokenCount) {
      return NextResponse.json(
        {
          error: `Insufficient token balance. You own ${holding?.tokenBalance || 0} tokens of this property.`,
        },
        { status: 400 }
      );
    }

    // Check property exists
    const property = await db.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Create the market order
    const order = await db.marketOrder.create({
      data: {
        sellerId: session.user.id,
        propertyId,
        tokenCount,
        pricePerTokenUSD,
        status: "OPEN",
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "MARKET_ORDER_CREATED",
        resource: "MarketOrder",
        resourceId: order.id,
        metadata: JSON.stringify({
          propertyId,
          tokenCount,
          pricePerTokenUSD,
          totalValue: tokenCount * pricePerTokenUSD,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Sell order created successfully",
      order,
    });
  } catch (error) {
    console.error("Failed to create market order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/market/orders
 * Cancel an open order (only the seller can cancel)
 */
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await db.marketOrder.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.sellerId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the seller can cancel this order" },
        { status: 403 }
      );
    }

    if (order.status !== "OPEN") {
      return NextResponse.json(
        { error: "Only open orders can be cancelled" },
        { status: 400 }
      );
    }

    await db.marketOrder.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Failed to cancel order:", error);
    return NextResponse.json(
      { error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}