import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

/**
 * OPay Webhook Handler
 * 
 * Receives payment event notifications from OPay.
 * - Verifies the HMAC-SHA256 signature.
 * - On successful payment, updates transaction to SUCCESS and credits user wallet.
 */
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-opay-signature") || req.headers.get("authorization")?.replace("Bearer ", "");

    // Verify OPay signature
    const secret = process.env.OPAY_WEBHOOK_SECRET || process.env.OPAY_SECRET_KEY || "";
    const hash = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature && signature !== hash) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const eventType = event.event || event.type || event.status;

    // OPay typically sends payment status updates
    if (eventType === "PAYMENT_SUCCESS" || eventType === "SUCCESS" || event.status === "SUCCESS") {
      const orderId = event.data?.orderNo || event.data?.orderId || event.orderId;
      const reference = event.data?.reference || event.reference || orderId;

      // Find transaction by reference or OPay order ID
      const transaction = await db.transaction.findFirst({
        where: {
          OR: [
            { txReference: reference },
            { providerRef: orderId },
            { providerRef: event.data?.orderNo },
          ],
        },
      });

      if (!transaction) {
        return NextResponse.json({ received: true, status: "not_found" });
      }

      // Update transaction to SUCCESS
      await db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          providerRef: orderId || transaction.providerRef,
          metadata: JSON.stringify({
            ...(transaction.metadata ? JSON.parse(transaction.metadata) : {}),
            opayData: event.data || event,
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
                txReference: transaction.txReference,
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
          // Skip on metadata parse failure
        }
      }

      return NextResponse.json({ received: true, status: "processed" });
    }

    // Handle payment failure
    if (eventType === "PAYMENT_FAILED" || eventType === "FAILED" || event.status === "FAILED") {
      const ref = event.data?.reference || event.reference || event.data?.orderNo;
      if (ref) {
        await db.transaction.updateMany({
          where: { OR: [{ txReference: ref }, { providerRef: ref }] },
          data: { status: "FAILED" },
        });
      }
      return NextResponse.json({ received: true, status: "failed" });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("OPay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}