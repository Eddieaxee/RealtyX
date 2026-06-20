import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireKycForTransaction } from "@/lib/kyc-guard";
import { convertUSDToNGN, convertNGNToUSD } from "@/lib/currency";
import {
  processPaystackWithdrawal,
  getAvailablePaymentMethods,
} from "@/lib/payments/payment-providers";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wallet = await db.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json({
        success: true,
        balance: { usd: 0, ngn: 0 },
        availableMethods: [],
      });
    }

    const methods = getAvailablePaymentMethods().filter(
      (m) => m.id === "paystack" || m.id === "opay" || m.id === "spendex"
    );

    return NextResponse.json({
      success: true,
      balance: {
        usd: wallet.balanceUSD,
        ngn: wallet.balanceNGN,
        totalInvested: wallet.totalInvested,
        totalReturns: wallet.totalReturns,
      },
      availableMethods: methods,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch withdrawal info" },
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
    // Enforce KYC before withdrawal
    await requireKycForTransaction(session.user.id, "WITHDRAWAL");

    const body = await req.json();
    const { method, amount, currency, bankAccount, accountName, bankCode } = body;

    if (!method || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid withdrawal method or amount" },
        { status: 400 }
      );
    }

    // Get user's wallet
    const wallet = await db.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet not found" },
        { status: 404 }
      );
    }

    // Check sufficient balance
    const amountInUSD = currency === "NGN" 
      ? await convertNGNToUSD(amount) 
      : amount;

    if (wallet.balanceUSD < amountInUSD) {
      return NextResponse.json(
        { error: "Insufficient balance", code: "INSUFFICIENT_BALANCE" },
        { status: 400 }
      );
    }

    // Check if method is available
    const availableMethods = getAvailablePaymentMethods();
    const methodInfo = availableMethods.find((m) => m.id === method);

    if (!methodInfo) {
      return NextResponse.json(
        { 
          error: `${method.toUpperCase()} is not configured yet. Please contact support or try another method.`,
          code: "METHOD_UNAVAILABLE",
          availableMethods: availableMethods.map(m => m.id),
        },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `WIT-${Date.now()}-${session.user.id.slice(0, 8)}`;

    let result;

    // Process withdrawal based on method
    switch (method) {
      case "paystack":
        if (!bankCode || !bankAccount) {
          return NextResponse.json(
            { error: "Bank code and account number required for Paystack" },
            { status: 400 }
          );
        }
        result = await processPaystackWithdrawal({
          amount,
          currency: currency || "NGN",
          accountNumber: bankAccount,
          bankCode,
          accountName: accountName || "User",
          reference,
        });
        break;

      case "opay":
        // OPay withdrawal - would need OPay API integration
        // For now, return not implemented
        return NextResponse.json(
          { 
            error: "OPay withdrawals are being integrated. Please use Paystack for now.",
            code: "METHOD_COMING_SOON",
          },
          { status: 400 }
        );

      case "spendex":
        // SpendEx withdrawal - would need SpendEx API integration
        return NextResponse.json(
          { 
            error: "SpendEx withdrawals are being integrated. Please use Paystack for now.",
            code: "METHOD_COMING_SOON",
          },
          { status: 400 }
        );

      case "crypto":
        // Crypto withdrawal - send to user's wallet address
        if (!bankAccount) {
          return NextResponse.json(
            { error: "Wallet address required for crypto withdrawal" },
            { status: 400 }
          );
        }
        // In production, this would initiate a blockchain transaction
        result = {
          success: true,
          reference,
          provider: "crypto",
          transferId: `crypto_${reference}`,
          status: "processing" as const,
          message: "Crypto withdrawal initiated",
        };
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported withdrawal method" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Withdrawal failed" },
        { status: 400 }
      );
    }

    // Deduct from wallet (in USD)
    const ngnAmount = currency === "NGN" ? amount : await convertUSDToNGN(amount);
    const usdAmount = amountInUSD;

    await db.wallet.update({
      where: { userId: session.user.id },
      data: {
        balanceUSD: { decrement: usdAmount },
        balanceNGN: { decrement: ngnAmount },
        totalWithdrawn: { increment: usdAmount },
      },
    });

    // Create withdrawal transaction
    await db.transaction.create({
      data: {
        userId: session.user.id,
        type: "WITHDRAWAL",
        amountUSD: usdAmount,
        amountNGN: ngnAmount,
        status: result.status === "completed" ? "COMPLETED" : "PENDING",
        paymentMethod: method.toUpperCase(),
        txReference: reference,
        providerRef: result.transferId,
        metadata: JSON.stringify({
          bankAccount,
          accountName,
          bankCode,
          details: result.details,
        }),
      },
    });

    // Log audit
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "WITHDRAWAL",
        resource: "Transaction",
        metadata: JSON.stringify({ amount: usdAmount, currency, method }),
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      reference,
      transaction: {
        type: "WITHDRAWAL",
        amount: usdAmount,
        currency: "USD",
        method: method.toUpperCase(),
        status: result.status,
      },
      message: "Withdrawal request submitted successfully",
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, code: "KYC_REQUIRED" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process withdrawal" },
      { status: 500 }
    );
  }
}