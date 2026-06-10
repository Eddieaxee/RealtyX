import { NextResponse } from "next/server";

const DEFAULT_RATE = 1520; // Fallback NGN per USD

export async function GET() {
  try {
    // Try to fetch live rate from a free API
    const res = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
      { next: { revalidate: 1800 } }, // Cache for 30 minutes
    );

    if (res.ok) {
      const data = await res.json();
      const ngnRate = data?.rates?.NGN;
      if (typeof ngnRate === "number" && ngnRate > 0) {
        return NextResponse.json({ rate: ngnRate, source: "live" });
      }
    }

    // Fallback to default rate
    return NextResponse.json({ rate: DEFAULT_RATE, source: "fallback" });
  } catch {
    return NextResponse.json({ rate: DEFAULT_RATE, source: "fallback" });
  }
}