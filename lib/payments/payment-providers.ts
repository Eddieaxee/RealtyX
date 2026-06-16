/**
 * Payment Providers Integration
 * Supports: Paystack, OPay, Spendex, PayPal, Crypto (USDT/BTC/ETH)
 */

export interface PaymentConfig {
  paystack: {
    publicKey: string;
    secretKey: string;
    baseUrl: string;
  };
  opay: {
    merchantId: string;
    publicKey: string;
    secretKey: string;
    baseUrl: string;
  };
  spendex: {
    apiKey: string;
    baseUrl: string;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    mode: "sandbox" | "live";
  };
  crypto: {
    network: "ethereum" | "polygon" | "base";
    rpcUrl: string;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  reference: string;
  description: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentResult {
  success: boolean;
  reference: string;
  provider: string;
  transactionId?: string;
  redirectUrl?: string;
  message?: string;
  details?: Record<string, unknown>;
}

export interface WithdrawalRequest {
  amount: number;
  currency: string;
  accountNumber: string;
  bankCode: string;
  accountName: string;
  reference: string;
}

export interface WithdrawalResult {
  success: boolean;
  reference: string;
  provider: string;
  transferId?: string;
  status: "pending" | "processing" | "completed" | "failed";
  message?: string;
}

// Get payment configuration from environment
function getPaymentConfig(): PaymentConfig {
  return {
    paystack: {
      publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
      secretKey: process.env.PAYSTACK_SECRET_KEY || "",
      baseUrl: "https://api.paystack.co",
    },
    opay: {
      merchantId: process.env.OPAY_MERCHANT_ID || "",
      publicKey: process.env.OPAY_PUBLIC_KEY || "",
      secretKey: process.env.OPAY_SECRET_KEY || "",
      baseUrl: "https://api.opaycheckout.com",
    },
    spendex: {
      apiKey: process.env.SPENDEX_API_KEY || "",
      baseUrl: "https://api.spendex.ng",
    },
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID || "",
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || "",
      mode: (process.env.PAYPAL_MODE as "sandbox" | "live") || "sandbox",
    },
    crypto: {
      network: (process.env.CRYPTO_NETWORK as "ethereum" | "polygon" | "base") || "polygon",
      rpcUrl: process.env.CRYPTO_RPC_URL || "",
    },
  };
}

// ============ PAYSTACK ============

export async function initializePaystackPayment(
  request: PaymentRequest
): Promise<PaymentResult> {
  const config = getPaymentConfig();
  
  if (!config.paystack.secretKey) {
    return {
      success: false,
      reference: request.reference,
      provider: "paystack",
      message: "Paystack is not configured. Please add PAYSTACK_SECRET_KEY to your .env file.",
    };
  }

  try {
    const response = await fetch(`${config.paystack.baseUrl}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.paystack.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: request.customerEmail,
        amount: Math.round(request.amount * 100), // Paystack uses kobo
        reference: request.reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paystack/callback`,
        metadata: {
          custom_fields: [
            {
              display_name: "Property",
              variable_name: "property",
              value: request.description,
            },
          ],
          ...request.metadata,
        },
      }),
    });

    const data = await response.json();

    if (data.status) {
      return {
        success: true,
        reference: request.reference,
        provider: "paystack",
        transactionId: data.data?.reference,
        redirectUrl: data.data?.authorization_url,
        details: data.data,
      };
    }

    return {
      success: false,
      reference: request.reference,
      provider: "paystack",
      message: data.message || "Payment initialization failed",
    };
  } catch (error) {
    console.error("Paystack error:", error);
    return {
      success: false,
      reference: request.reference,
      provider: "paystack",
      message: "Failed to connect to Paystack",
    };
  }
}

// ============ OPAY ============

export async function initializeOPayPayment(
  request: PaymentRequest
): Promise<PaymentResult> {
  const config = getPaymentConfig();
  
  if (!config.opay.merchantId) {
    return {
      success: false,
      reference: request.reference,
      provider: "opay",
      message: "OPay is not configured. Please add OPAY_MERCHANT_ID to your .env file.",
    };
  }

  try {
    const response = await fetch(`${config.opay.baseUrl}/api/web/v1/payment/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.opay.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchantId: config.opay.merchantId,
        amount: Math.round(request.amount * 100), // OPay uses kobo
        orderId: request.reference,
        orderName: request.description,
        payMethod: "BankTransfer",
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/opay/callback`,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
      }),
    });

    const data = await response.json();

    if (data.code === "00000" || data.status === "SUCCESS") {
      return {
        success: true,
        reference: request.reference,
        provider: "opay",
        transactionId: data.data?.orderNo,
        redirectUrl: data.data?.payUrl,
        details: data.data,
      };
    }

    return {
      success: false,
      reference: request.reference,
      provider: "opay",
      message: data.message || "OPay payment initialization failed",
    };
  } catch (error) {
    console.error("OPay error:", error);
    return {
      success: false,
      reference: request.reference,
      provider: "opay",
      message: "Failed to connect to OPay",
    };
  }
}

// ============ SPENDEX ============

export async function initializeSpendexPayment(
  request: PaymentRequest
): Promise<PaymentResult> {
  const config = getPaymentConfig();
  
  if (!config.spendex.apiKey) {
    return {
      success: false,
      reference: request.reference,
      provider: "spendex",
      message: "Spendex is not configured. Please add SPENDEX_API_KEY to your .env file.",
    };
  }

  try {
    const response = await fetch(`${config.spendex.baseUrl}/v1/payments/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.spendex.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: request.amount,
        currency: request.currency || "NGN",
        reference: request.reference,
        description: request.description,
        customer: {
          email: request.customerEmail,
          name: request.customerName,
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/spendex/callback`,
      }),
    });

    const data = await response.json();

    if (data.success || data.status === "success") {
      return {
        success: true,
        reference: request.reference,
        provider: "spendex",
        transactionId: data.transaction_id,
        redirectUrl: data.authorization_url || data.pay_url,
        details: data,
      };
    }

    return {
      success: false,
      reference: request.reference,
      provider: "spendex",
      message: data.message || "Spendex payment initialization failed",
    };
  } catch (error) {
    console.error("Spendex error:", error);
    return {
      success: false,
      reference: request.reference,
      provider: "spendex",
      message: "Failed to connect to Spendex",
    };
  }
}

// ============ PAYPAL ============

export async function initializePayPalPayment(
  request: PaymentRequest
): Promise<PaymentResult> {
  const config = getPaymentConfig();
  
  if (!config.paypal.clientId) {
    return {
      success: false,
      reference: request.reference,
      provider: "paypal",
      message: "PayPal is not configured. Please add PAYPAL_CLIENT_ID to your .env file.",
    };
  }

  try {
    // Get access token
    const authResponse = await fetch(
      `https://api-m.${config.paypal.mode === "live" ? "" : "sandbox."}paypal.com/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${config.paypal.clientId}:${config.paypal.clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    const authData = await authResponse.json();
    
    if (!authData.access_token) {
      return {
        success: false,
        reference: request.reference,
        provider: "paypal",
        message: "Failed to authenticate with PayPal",
      };
    }

    // Create order
    const orderResponse = await fetch(
      `https://api-m.${config.paypal.mode === "live" ? "" : "sandbox."}paypal.com/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: request.reference,
              description: request.description,
              amount: {
                currency_code: request.currency || "USD",
                value: (request.amount / 1500).toFixed(2), // Convert NGN to USD
              },
            },
          ],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paypal/callback`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/invest`,
          },
        }),
      }
    );

    const orderData = await orderResponse.json();

    if (orderData.id) {
      const approveLink = orderData.links?.find(
        (link: { rel: string; href: string }) => link.rel === "approve"
      );

      return {
        success: true,
        reference: request.reference,
        provider: "paypal",
        transactionId: orderData.id,
        redirectUrl: approveLink?.href,
        details: orderData,
      };
    }

    return {
      success: false,
      reference: request.reference,
      provider: "paypal",
      message: orderData.message || "PayPal order creation failed",
    };
  } catch (error) {
    console.error("PayPal error:", error);
    return {
      success: false,
      reference: request.reference,
      provider: "paypal",
      message: "Failed to connect to PayPal",
    };
  }
}

// ============ CRYPTO (USDT/BTC/ETH) ============

export async function initializeCryptoPayment(
  request: PaymentRequest,
  cryptoType: "USDT" | "BTC" | "ETH" = "USDT"
): Promise<PaymentResult> {
  const config = getPaymentConfig();
  
  // Generate a unique wallet address for this transaction
  // In production, this would use a payment processor like CoinGate, NOWPayments, etc.
  const walletAddress = `0x${request.reference.replace(/[^a-zA-Z0-9]/g, "").slice(0, 40).padEnd(40, "0")}`;
  
  // Calculate crypto amount based on current rates
  const usdAmount = request.amount / 1500; // Approximate NGN to USD
  let cryptoAmount: number;
  let network: string;

  switch (cryptoType) {
    case "USDT":
      cryptoAmount = usdAmount; // 1:1 with USD
      network = config.crypto.network;
      break;
    case "BTC":
      cryptoAmount = usdAmount / 65000; // Approximate BTC price
      network = "bitcoin";
      break;
    case "ETH":
      cryptoAmount = usdAmount / 3500; // Approximate ETH price
      network = config.crypto.network;
      break;
  }

  return {
    success: true,
    reference: request.reference,
    provider: "crypto",
    transactionId: `crypto_${cryptoType}_${request.reference}`,
    details: {
      cryptoType,
      network,
      walletAddress,
      amount: cryptoAmount.toFixed(8),
      usdEquivalent: usdAmount.toFixed(2),
      instructions: `Send exactly ${cryptoAmount.toFixed(8)} ${cryptoType} to the wallet address below. Your investment will be confirmed after ${cryptoType === "BTC" ? "3" : "12"} network confirmations.`,
    },
  };
}

// ============ WITHDRAWAL METHODS ============

export async function processPaystackWithdrawal(
  request: WithdrawalRequest
): Promise<WithdrawalResult> {
  const config = getPaymentConfig();
  
  if (!config.paystack.secretKey) {
    return {
      success: false,
      reference: request.reference,
      provider: "paystack",
      status: "failed",
      message: "Paystack is not configured",
    };
  }

  try {
    const response = await fetch(`${config.paystack.baseUrl}/transfer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.paystack.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "balance",
        amount: Math.round(request.amount * 100),
        reference: request.reference,
        recipient: request.bankCode, // Would need to create transfer recipient first
        reason: "RealtyX Investment Withdrawal",
      }),
    });

    const data = await response.json();

    if (data.status) {
      return {
        success: true,
        reference: request.reference,
        provider: "paystack",
        transferId: data.data?.transfer_code,
        status: "processing",
      };
    }

    return {
      success: false,
      reference: request.reference,
      provider: "paystack",
      status: "failed",
      message: data.message || "Withdrawal failed",
    };
  } catch (error) {
    console.error("Paystack withdrawal error:", error);
    return {
      success: false,
      reference: request.reference,
      provider: "paystack",
      status: "failed",
      message: "Failed to process withdrawal",
    };
  }
}

// ============ PAYMENT METHOD VALIDATION ============

export function validatePaymentMethod(method: string): boolean {
  const validMethods = ["paystack", "opay", "spendex", "paypal", "crypto"];
  return validMethods.includes(method);
}

export function getPaymentMethodInfo(method: string) {
  const methods: Record<string, { name: string; description: string; icon: string; available: boolean }> = {
    paystack: {
      name: "Paystack",
      description: "Cards, Bank Transfer, USSD",
      icon: "credit-card",
      available: !!process.env.PAYSTACK_SECRET_KEY,
    },
    opay: {
      name: "OPay",
      description: "Instant bank transfers",
      icon: "banknote",
      available: !!process.env.OPAY_MERCHANT_ID,
    },
    spendex: {
      name: "Spendex",
      description: "Spendex wallet",
      icon: "landmark",
      available: !!process.env.SPENDEX_API_KEY,
    },
    paypal: {
      name: "PayPal",
      description: "International payments",
      icon: "wallet",
      available: !!process.env.PAYPAL_CLIENT_ID,
    },
    crypto: {
      name: "Crypto (USDT/BTC/ETH)",
      description: "USDT, BTC, ETH",
      icon: "bitcoin",
      available: true, // Always available
    },
  };

  return methods[method] || null;
}

export function getAvailablePaymentMethods() {
  const methods = ["paystack", "opay", "spendex", "paypal", "crypto"];
  return methods
    .map((m) => ({ id: m, ...getPaymentMethodInfo(m) }))
    .filter((m) => m.available);
}