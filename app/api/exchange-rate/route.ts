import { NextResponse } from "next/server";

// Cache for exchange rates
let rateCache: { usdToNgn: number; lastUpdated: Date } | null = null;

async function fetchLiveRate(): Promise<number> {
  try {
    // Try multiple free APIs for redundancy
    const responses = await Promise.allSettled([
      fetch("https://api.exchangerate-api.com/v4/latest/USD", { signal: AbortSignal.timeout(5000) }),
      fetch("https://open.er-api.com/v6/latest/USD", { signal: AbortSignal.timeout(5000) }),
    ]);

    for (const res of responses) {
      if (res.status === "fulfilled") {
        const data = await res.value.json();
        const ngnRate = data.rates?.NGN;
        if (ngnRate && typeof ngnRate === "number") {
          return ngnRate;
        }
      }
    }

    // Fallback to approximate rate if APIs fail
    console.warn("Exchange rate APIs failed, using fallback rate");
    return 1540;
  } catch (error) {
    console.error("Exchange rate fetch failed:", error);
    // Return last known good rate if available, otherwise fallback
    return rateCache?.usdToNgn || 1540;
  }
}

export async function GET() {
  const now = new Date();

  // Refresh cache every 1 hour
  if (!rateCache || (now.getTime() - rateCache.lastUpdated.getTime()) > 3600000) {
    const rate = await fetchLiveRate();
    rateCache = { usdToNgn: rate, lastUpdated: now };
  }

  return NextResponse.json({
    success: true,
    usdToNgn: rateCache.usdToNgn,
    ngnToUsd: 1 / rateCache.usdToNgn,
    lastUpdated: rateCache.lastUpdated.toISOString(),
  });
}