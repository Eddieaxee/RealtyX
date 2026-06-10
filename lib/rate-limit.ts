import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;
const WINDOW_MS = 60 * 1000;
export function rateLimit(request: NextRequest) {
  const ip = request.ip ?? "anonymous";
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return null;
  }
  if (record.count >= RATE_LIMIT) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }
  record.count++;
  return null;
}
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, record] of Array.from(rateLimitMap.entries())) {
      if (now > record.resetTime) rateLimitMap.delete(ip);
    }
  },
  5 * 60 * 1000,
);
