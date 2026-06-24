import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

type AssetHoldingClient = {
  upsert: (...args: unknown[]) => Promise<unknown>;
} | undefined;

function getAssetHoldingClient(): AssetHoldingClient {
  return (db as unknown as { assetHolding?: AssetHoldingClient }).assetHolding;
}

/**
 * Paystack Webhook Handler
 *
 * Receives payment event notifications from Paystack.
 * - Verifies the HMAC-SHA512 signature to ensure authenticity.
 * - On successful charge.completed, updates transaction to SUCCESS
 *   and credits the user's wallet.
 * - Supports direct checkout flow: if the transaction has property metadata,
 *   it auto-executes the token purchase.
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    // Verify Paystack signature
    const secret = process.env.PAYSTACK_SECRET_KEY || "";
    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

    if (signature !== hash) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Only process successful charges
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const data = event.data;
    const reference = data.reference;

    // Find the transaction by reference
    const transaction = await db.transaction.findFirst({
      where: { txReference: reference },
      include: { user: true },
    });

    if (!transaction) {
      // Check if this is a direct checkout payment (stored in metadata)
      const metadata = data.metadata || {};
      const propertyId = metadata.property_id;
      const userId = metadata.user_id;
      const tokenQuantity = metadata.token_quantity;

      if (propertyId && userId && tokenQuantity) {
        // Direct checkout pipeline: create transaction + execute investment
        const amountUSD = data.amount / 100; // Paystack uses kobo/smallest unit
        const amountNGN = data.amount / 100;

        // Create the transaction record
        await db.transaction.create({
          data: {
            userId,
            type: "INVESTMENT",
            amountUSD,
            amountNGN,
            amountLocal: amountNGN,
            currency: "NGN",
            gateway: "PAYSTACK",
            status: "SUCCESS",
            paymentMethod: "CARD",
            txReference: reference,
            providerRef: data.id?.toString() || reference,
            metadata: JSON.stringify({
              propertyId,
              tokenQuantity,
              ...metadata,
            }),
          },
        });

        // Update wallet balance
        await db.wallet.upsert({
          where: { userId },
          update: {
            balanceUSD: { increment: amountUSD },
            balanceNGN: { increment: amountNGN },
            totalInvested: { increment: amountUSD },
          },
          create: {
            userId,
            balanceUSD: amountUSD,
            balanceNGN: amountNGN,
            totalInvested: amountUSD,
          },
        });

        // Create investment record
        await db.investment.create({
          data: {
            userId,
            propertyId,
            tokens: tokenQuantity,
            amountUSD,
            amountNGN,
            status: "ACTIVE",
            paymentMethod: "CARD",
            txReference: reference,
          },
        });

        // Update property available tokens
        await db.property.update({
          where: { id: propertyId },
          data: { availableTokens: { decrement: tokenQuantity } },
        });

        // Update/Create asset holding
        const assetHolding = getAssetHoldingClient();
        if (assetHolding) {
          await assetHolding.upsert({
            where: { userId_propertyId: { userId, propertyId } },
            update: { tokenBalance: { increment: tokenQuantity } },
            create: { userId, propertyId, tokenBalance: tokenQuantity },
          });
        }
      }

      return NextResponse.json({ received: true });
    }

    // Update transaction status to SUCCESS
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "SUCCESS",
        providerRef: data.id?.toString() || reference,
        metadata: JSON.stringify({
          ...(transaction.metadata ? JSON.parse(transaction.metadata) : {}),
          paystackData: data,
        }),
      },
    });

    // Credit user's wallet
    if (transaction.type === "DEPOSIT") {
      const amountUSD = transaction.amountUSD;
      const amountNGN = transaction.amountNGN || 0;

      await db.wallet.upsert({
        where: { userId: transaction.userId },
        update: {
          balanceUSD: { increment: amountUSD },
          balanceNGN: { increment: amountNGN },
        },
        create: {
          userId: transaction.userId,
          balanceUSD: amountUSD,
          balanceNGN: amountNGN,
        },
      });
    }

    // If this is a direct investment transaction, execute token purchase
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

          const assetHolding = getAssetHoldingClient();
          if (assetHolding) {
            await assetHolding.upsert({
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
        }
      } catch {
        // Metadata parsing failed, skip investment execution
      }
    }

    return NextResponse.json({ received: true, status: "processed" });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}