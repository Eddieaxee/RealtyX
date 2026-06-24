import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

/**
 * Spendex Webhook Handler
 * 
 * Receives payment event notifications from Spendex.
 * - Verifies the HMAC-SHA256 signature.
 * - Handles: payment.success, payment.failed, deposit.address (crypto deposit address generation)
 * - On successful payment, updates transaction to SUCCESS and credits user wallet.
 * - For crypto deposits, maps incoming coin to USD value and credits the user.
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-spendex-signature");

    // Verify Spendex signature
    const secret = process.env.SPENDEX_API_KEY || "";
    const hash = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== hash) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const eventType = event.event || event.type;

    switch (eventType) {
      case "payment.success":
      case "charge.success": {
        const reference = event.data?.reference || event.data?.tx_ref;
        const transaction = await db.transaction.findFirst({
          where: { txReference: reference },
        });

        if (!transaction) {
          return NextResponse.json({ received: true, status: "not_found" });
        }

        // Update transaction to SUCCESS
        await db.transaction.update({
          where: { id: transaction.id },
          data: {
            status: "SUCCESS",
            providerRef: event.data?.id?.toString() || reference,
            metadata: JSON.stringify({
              ...(transaction.metadata ? JSON.parse(transaction.metadata) : {}),
              spendexData: event.data,
            }),
          },
        });

        // Credit user wallet
        if (transaction.type === "DEPOSIT") {
          await db.wallet.upsert({
            where: { userId: transaction.userId },
            update: {
              balanceUSD: { increment: transaction.amountUSD },
              balanceNGN: { increment: transaction.amountNGN || 0 },
            },
            create: {
              userId: transaction.userId,
              balanceUSD: transaction.amountUSD,
              balanceNGN: transaction.amountNGN || 0,
            },
          });
        }

        // Direct checkout pipeline for investments
        if (transaction.type === "INVESTMENT" && transaction.metadata) {
          try {
            const meta = JSON.parse(transaction.metadata);
            if (meta.propertyId && meta.tokenQuantity) {
              await db.investment.create({
                data: {
                  userId: transaction.userId,
                  propertyId: meta.propertyId,
                  tokens: meta.tokenQuantity,
                  amountUSD: transaction.amountUSD,
                  amountNGN: transaction.amountNGN || 0,
                  status: "ACTIVE",
                  paymentMethod: transaction.paymentMethod,
                  txReference: reference,
                },
              });

              await db.property.update({
                where: { id: meta.propertyId },
                data: { availableTokens: { decrement: meta.tokenQuantity } },
              });

              await db.assetHolding.upsert({
                where: {
                  userId_propertyId: {
                    userId: transaction.userId,
                    propertyId: meta.propertyId,
                  },
                },
                update: { tokenBalance: { increment: meta.tokenQuantity } },
                create: {
                  userId: transaction.userId,
                  propertyId: meta.propertyId,
                  tokenBalance: meta.tokenQuantity,
                },
              });
            }
          } catch {
            // Skip investment execution on metadata parse failure
          }
        }

        return NextResponse.json({ received: true, status: "processed" });
      }

      case "payment.failed":
      case "charge.failed": {
        const ref = event.data?.reference || event.data?.tx_ref;
        if (ref) {
          await db.transaction.updateMany({
            where: { txReference: ref },
            data: { status: "FAILED" },
          });
        }
        return NextResponse.json({ received: true, status: "failed" });
      }

      case "deposit.address":
      case "crypto.deposit": {
        // Crypto deposit notification from Spendex
        const { userId, coin, usdValue, txHash } = event.data || {};
        if (userId && usdValue) {
          await db.transaction.create({
            data: {
              userId,
              type: "DEPOSIT",
              amountUSD: parseFloat(usdValue),
              currency: coin || "USDT",
              gateway: "SPENDEX",
              status: "SUCCESS",
              paymentMethod: coin || "USDT",
              txReference: txHash || `spendex-crypto-${Date.now()}`,
              providerRef: event.data?.id?.toString(),
              metadata: JSON.stringify(event.data),
            },
          });

          await db.wallet.upsert({
            where: { userId },
            update: { balanceUSD: { increment: parseFloat(usdValue) } },
            create: { userId, balanceUSD: parseFloat(usdValue) },
          });
        }
        return NextResponse.json({ received: true, status: "credited" });
      }

      default:
        return NextResponse.json({ received: true });
    }
  } catch (error) {
    console.error("Spendex webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}