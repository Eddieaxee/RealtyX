import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  initializePaystackPayment,
  initializeOPayPayment,
  initializeSpendexPayment,
  initializePayPalPayment,
  initializeCryptoPayment,
  validatePaymentMethod,
} from "@/lib/payments/payment-providers";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, currency, method, propertyId, propertyName, customerEmail, customerName } = body;

    if (!amount || !method) {
      return NextResponse.json({ error: "Amount and payment method are required" }, { status: 400 });
    }

    if (!validatePaymentMethod(method)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const reference = `RX-${method.toUpperCase()}-${Date.now()}`;

    const paymentRequest = {
      amount: Number(amount),
      currency: currency || "NGN",
      reference,
      description: `Investment in ${propertyName || "Property"}`,
      customerEmail: customerEmail || session.user.email || "",
      customerName: customerName || session.user.name || "",
      metadata: {
        propertyId,
        userId: session.user.id,
      },
    };

    let result;

    switch (method) {
      case "paystack":
        result = await initializePaystackPayment(paymentRequest);
        break;
      case "opay":
        result = await initializeOPayPayment(paymentRequest);
        break;
      case "spendex":
        result = await initializeSpendexPayment(paymentRequest);
        break;
      case "paypal":
        result = await initializePayPalPayment(paymentRequest);
        break;
      case "crypto":
        result = await initializeCryptoPayment(paymentRequest);
        break;
      default:
        return NextResponse.json({ error: "Unsupported payment method" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}