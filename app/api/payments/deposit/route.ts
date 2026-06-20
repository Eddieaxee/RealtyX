import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  initializePaystackPayment,
  initializeOPayPayment,
  initializeSpendexPayment,
  initializePayPalPayment,
  initializeCryptoPayment,
  getAvailablePaymentMethods,
} from "@/lib/payments/payment-providers";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const methods = getAvailablePaymentMethods();
    return NextResponse.json({ success: true, methods });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
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
    const body = await req.json();
    const { method, amount, currency, description } = body;

    if (!method || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment method or amount" },
        { status: 400 }
      );
    }

    // Get available methods
    const availableMethods = getAvailablePaymentMethods();
    const methodInfo = availableMethods.find((m) => m.id === method);

    if (!methodInfo) {
      return NextResponse.json(
        { error: "Payment method not available", code: "METHOD_UNAVAILABLE" },
        { status: 400 }
      );
    }

    // Generate unique reference
    const reference = `DEP-${Date.now()}-${session.user.id.slice(0, 8)}`;

    let result;

    switch (method) {
      case "paystack":
        result = await initializePaystackPayment({
          amount,
          currency: currency || "NGN",
          reference,
          description: description || "Wallet Deposit",
          customerEmail: session.user.email!,
          customerName: session.user.name || "User",
        });
        break;

      case "opay":
        result = await initializeOPayPayment({
          amount,
          currency: currency || "NGN",
          reference,
          description: description || "Wallet Deposit",
          customerEmail: session.user.email!,
          customerName: session.user.name || "User",
        });
        break;

      case "spendex":
        result = await initializeSpendexPayment({
          amount,
          currency: currency || "NGN",
          reference,
          description: description || "Wallet Deposit",
          customerEmail: session.user.email!,
          customerName: session.user.name || "User",
        });
        break;

      case "paypal":
        result = await initializePayPalPayment({
          amount,
          currency: "USD",
          reference,
          description: description || "Wallet Deposit",
          customerEmail: session.user.email!,
          customerName: session.user.name || "User",
        });
        break;

      case "crypto":
        result = await initializeCryptoPayment(
          {
            amount,
            currency: "USD",
            reference,
            description: description || "Wallet Deposit",
            customerEmail: session.user.email!,
            customerName: session.user.name || "User",
          },
          "USDT"
        );
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported payment method" },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Payment initialization failed" },
        { status: 400 }
      );
    }

    // Create pending transaction record
    await db.transaction.create({
      data: {
        userId: session.user.id,
        type: "DEPOSIT",
        amountUSD: currency === "USD" ? amount : 0,
        amountNGN: currency === "NGN" ? amount : 0,
        status: "PENDING",
        paymentMethod: method.toUpperCase(),
        txReference: reference,
        providerRef: result.transactionId,
        metadata: JSON.stringify({
          redirectUrl: result.redirectUrl,
          details: result.details,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      reference,
      redirectUrl: result.redirectUrl,
      details: result.details,
      message: "Payment initialized. Please complete the payment.",
    });
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json(
      { error: "Failed to initialize deposit" },
      { status: 500 }
    );
  }
}