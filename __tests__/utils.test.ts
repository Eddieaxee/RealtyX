import { describe, it, expect } from "vitest";
import { formatCurrency, formatNumber, truncateAddress, cn } from "@/lib/utils";

describe("Utils", () => {
  it("formats currency correctly", () => {
    expect(formatCurrency(142850)).toBe("$142,850.00");
    expect(formatCurrency(0)).toBe("$0.00");
  });
  
  it("formats numbers correctly", () => {
    expect(formatNumber(50000)).toBe("50,000");
  });
  
  it("truncates addresses", () => {
    expect(truncateAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")).toBe("0x742d...5f0b");
  });
  
  it("combines class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });
});