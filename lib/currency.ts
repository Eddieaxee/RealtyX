/**
 * Currency Conversion Utility
 * Converts between USD and NGN using exchange rate API
 */

let cachedRate: number | null = null;
let cacheExpiry: number = 0;

export async function getUSDToNGNRate(): Promise<number> {
  // Return cached rate if still valid (1 hour cache)
  if (cachedRate && Date.now() < cacheExpiry) {
    return cachedRate;
  }

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    if (!apiKey) {
      // Fallback rate if no API key
      return 1500;
    }

    const data = await (await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/pair/USD/NGN`
    )).json();

    if (data.conversion_rate) {
      cachedRate = data.conversion_rate;
      cacheExpiry = Date.now() + (60 * 60 * 1000); // 1 hour
      return cachedRate as number;
    }

    return 1500; // Fallback
  } catch {
    return 1500; // Fallback rate
  }
}

export async function convertUSDToNGN(usd: number): Promise<number> {
  const rate = await getUSDToNGNRate();
  return Math.round(usd * rate);
}

export async function convertNGNToUSD(ngn: number): Promise<number> {
  const rate = await getUSDToNGNRate();
  return Math.round((ngn / rate) * 100) / 100;
}

export function formatCurrency(
  amount: number,
  currency: "USD" | "NGN",
): string {
  if (currency === "NGN") {
    return `₦${amount.toLocaleString("en-NG")}`;
  }
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatCrypto(amount: number, symbol: string): string {
  return `${amount.toFixed(6)} ${symbol}`;
}
