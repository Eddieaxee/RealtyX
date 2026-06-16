import { NextRequest, NextResponse } from "next/server";

// In-memory store of token purchases (resets on server restart)
// In production, this would be a database
const tokenPurchases: Record<string, number> = {};

/**
 * GET /api/invest — returns all token purchases keyed by propertyId
 */
export async function GET() {
  return NextResponse.json({ purchases: tokenPurchases });
}

/**
 * POST /api/invest — record a token purchase and reduce available tokens
 * Body: { propertyId: string, quantity: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, quantity } = body;

    if (!propertyId || typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid propertyId or quantity" },
        { status: 400 }
      );
    }

    // Record the purchase
    tokenPurchases[propertyId] = (tokenPurchases[propertyId] || 0) + quantity;

    return NextResponse.json({
      success: true,
      propertyId,
      quantity,
      totalPurchasedForProperty: tokenPurchases[propertyId],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}