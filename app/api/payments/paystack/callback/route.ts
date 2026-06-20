import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const status = searchParams.get("status");

  if (!reference) {
    return NextResponse.redirect(new URL("/wallet?error=missing_reference", process.env.NEXT_PUBLIC_APP_URL));
  }

  try {
    // Find the transaction
    const transaction = await db.transaction.findFirst({
      where: { txReference: reference },
      include: { user: true },
    });

    if (!transaction) {
      return NextResponse.redirect(new URL("/wallet?error=transaction_not_found", process.env.NEXT_PUBLIC_APP_URL));
    }

    // If payment was successful
    if (status === "success") {
      // Update transaction status
      await db.transaction.update({
        where: { id: transaction.id },
        data: { status: "COMPLETED" },
      });

      // Credit user's wallet
      const amountUSD = transaction.amountUSD;
      const amountNGN = transaction.amountNGN;

      await db.wallet.update({
        where: { userId: transaction.userId },
        data: {
          balanceUSD: { increment: amountUSD },
          balanceNGN: { increment: amountNGN },
        },
      });

      // Send confirmation email
      if (transaction.user.email) {
        sendEmail({
          to: transaction.user.email,
          subject: "Deposit Successful",
          template: "investment-confirmed",
          data: {
            userName: transaction.user.name || "User",
            amount: amountUSD > 0 ? `$${amountUSD}` : `₦${amountNGN}`,
            status: "Completed",
          },
          userId: transaction.userId,
        }).catch(() => {});
      }

      return NextResponse.redirect(new URL("/wallet?success=deposit_completed", process.env.NEXT_PUBLIC_APP_URL));
    } else {
      // Payment failed
      await db.transaction.update({
        where: { id: transaction.id },
        data: { status: "FAILED" },
      });

      return NextResponse.redirect(new URL("/wallet?error=payment_failed", process.env.NEXT_PUBLIC_APP_URL));
    }
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(new URL("/wallet?error=processing_error", process.env.NEXT_PUBLIC_APP_URL));
  }
}