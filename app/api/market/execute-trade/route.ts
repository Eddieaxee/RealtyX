import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Atomic Escrow Trading Engine
 * 
 * Processes P2P trades between two verified users atomically within
 * a secure database transaction block.
 * 
 * Flow when User B clicks to purchase an open listing from User A:
 * 1. Verify both users have kycStatus === "VERIFIED"
 * 2. Confirm User B has sufficient USD balance
 * 3. Confirm User A owns enough tokens
 * 4. Execute atomic transfers: balance + tokens
 * 5. Deduct platform fee (1.5%) to treasury
 */
const PLATFORM_FEE_PERCENT = 1.5; // 1.5% fee

export async function POST(req: Request) {
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

    // Execute trade atomically
    const result = await db.$transaction(async (tx) => {
      // 1. Fetch the market order with lock (SELECT FOR UPDATE equivalent)
      const order = await tx.marketOrder.findUnique({
        where: { id: orderId },
        include: {
          seller: { select: { id: true, kycStatus: true } },
          property: { select: { id: true, title: true } },
        },
      });

      if (!order) {
        throw new Error("Market order not found");
      }

      if (order.status !== "OPEN") {
        throw new Error("Order is no longer open");
      }

      const buyerId = session.user.id;
      const sellerId = order.sellerId;

      // Prevent self-trading
      if (buyerId === sellerId) {
        throw new Error("Cannot purchase your own listing");
      }

      // 2. Verify both users are KYC VERIFIED
      const buyer = await tx.user.findUnique({
        where: { id: buyerId },
        select: { kycStatus: true, role: true },
      });

      if (!buyer) {
        throw new Error("Buyer not found");
      }

      // Admins can bypass KYC
      const buyerVerified = buyer.kycStatus === "VERIFIED" || buyer.role === "ADMIN" || buyer.role === "SUPER_ADMIN";
      const sellerVerified = order.seller.kycStatus === "VERIFIED";

      if (!buyerVerified) {
        throw new Error("Buyer KYC verification required. Please complete KYC verification first.");
      }
      if (!sellerVerified) {
        throw new Error("Seller has not completed KYC verification");
      }

      const totalPriceUSD = order.tokenCount * order.pricePerTokenUSD;
      const feeUSD = (totalPriceUSD * PLATFORM_FEE_PERCENT) / 100;
      const sellerProceedUSD = totalPriceUSD - feeUSD;

      // 3. Check buyer's USD balance
      const buyerWallet = await tx.wallet.findUnique({
        where: { userId: buyerId },
      });

      if (!buyerWallet || buyerWallet.balanceUSD < totalPriceUSD) {
        throw new Error(
          `Insufficient balance. Required: $${totalPriceUSD.toFixed(2)}, Available: $${(buyerWallet?.balanceUSD || 0).toFixed(2)}`
        );
      }

      // 4. Check seller's token balance
      const sellerHolding = await tx.assetHolding.findUnique({
        where: {
          userId_propertyId: {
            userId: sellerId,
            propertyId: order.propertyId,
          },
        },
      });

      if (!sellerHolding || sellerHolding.tokenBalance < order.tokenCount) {
        throw new Error(
          `Seller does not have enough tokens. Required: ${order.tokenCount}, Available: ${sellerHolding?.tokenBalance || 0}`
        );
      }

      // 5. Execute the atomic balance and token transfers
      
      // Deduct from buyer
      await tx.wallet.update({
        where: { userId: buyerId },
        data: { balanceUSD: { decrement: totalPriceUSD } },
      });

      // Credit seller (minus fee)
      await tx.wallet.upsert({
        where: { userId: sellerId },
        update: { balanceUSD: { increment: sellerProceedUSD } },
        create: { userId: sellerId, balanceUSD: sellerProceedUSD },
      });

      // Deduct tokens from seller
      await tx.assetHolding.update({
        where: {
          userId_propertyId: {
            userId: sellerId,
            propertyId: order.propertyId,
          },
        },
        data: { tokenBalance: { decrement: order.tokenCount } },
      });

      // Add tokens to buyer
      await tx.assetHolding.upsert({
        where: {
          userId_propertyId: {
            userId: buyerId,
            propertyId: order.propertyId,
          },
        },
        update: { tokenBalance: { increment: order.tokenCount } },
        create: {
          userId: buyerId,
          propertyId: order.propertyId,
          tokenBalance: order.tokenCount,
        },
      });

      // Mark order as COMPLETED
      await tx.marketOrder.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      });

      // Create transaction records for both users
      await tx.transaction.create({
        data: {
          userId: buyerId,
          type: "INVESTMENT",
          amountUSD: totalPriceUSD,
          status: "SUCCESS",
          paymentMethod: "P2P_MARKET",
          txReference: `trade-${orderId}-buyer`,
          metadata: JSON.stringify({
            orderId,
            propertyId: order.propertyId,
            tokenCount: order.tokenCount,
            pricePerToken: order.pricePerTokenUSD,
            tradeType: "purchase",
          }),
        },
      });

      await tx.transaction.create({
        data: {
          userId: sellerId,
          type: "WITHDRAWAL",
          amountUSD: sellerProceedUSD,
          status: "SUCCESS",
          paymentMethod: "P2P_MARKET",
          txReference: `trade-${orderId}-seller`,
          metadata: JSON.stringify({
            orderId,
            propertyId: order.propertyId,
            tokenCount: order.tokenCount,
            pricePerToken: order.pricePerTokenUSD,
            tradeType: "sale",
            fee: feeUSD,
          }),
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: buyerId,
          action: "TRADE_EXECUTED",
          resource: "MarketOrder",
          resourceId: orderId,
          metadata: JSON.stringify({
            buyerId,
            sellerId,
            propertyId: order.propertyId,
            tokenCount: order.tokenCount,
            totalPriceUSD,
            feeUSD,
          }),
        },
      });

      return {
        success: true,
        orderId,
        propertyTitle: order.property.title,
        tokenCount: order.tokenCount,
        totalPriceUSD,
        feeUSD,
        sellerProceedUSD,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Trade executed successfully",
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Trade execution failed";
    console.error("Market trade error:", error);

    // Determine appropriate status code
    const status = message.includes("KYC") ? 403 :
                   message.includes("balance") || message.includes("tokens") ? 400 :
                   message.includes("not found") ? 404 : 500;

    return NextResponse.json(
      { error: message, success: false },
      { status }
    );
  }
}