"use client";

import { useCurrency } from "@/context/currency-context";

/**
 * SmartPrice - The single source of truth for displaying monetary values
 * across the entire application.
 *
 * Wrap ALL dollar amounts in this component.
 * - If global state is 'USD': displays as "$XX.XX USD"
 * - If global state is 'NGN': dynamically computes usdAmount * liveExchangeRate
 *   and displays as "₦XX,XXX"
 *
 * Switching the navbar toggle triggers an instantaneous, global recalculation.
 */
interface SmartPriceProps {
  usdAmount: number;
  className?: string;
  showSymbol?: boolean;
  showCurrency?: boolean;
  noConvert?: boolean; // If true, shows raw USD even in NGN mode (for internal calculations)
}

export function SmartPrice({
  usdAmount,
  className = "",
  showSymbol = true,
  showCurrency = false,
  noConvert = false,
}: SmartPriceProps) {
  const { currency, convertAmount } = useCurrency();

  if (noConvert) {
    // Always show USD regardless of toggle
    const formatted = usdAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <span className={className}>
        {showSymbol && "$"}
        {formatted}
        {showCurrency && " USD"}
      </span>
    );
  }

  if (currency === "USD") {
    const formatted = usdAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <span className={className}>
        {showSymbol && "$"}
        {formatted}
        {showCurrency && " USD"}
      </span>
    );
  }

  // NGN mode: convert and display
  const ngnAmount = convertAmount(usdAmount);
  const formatted = ngnAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <span className={className}>
      {showSymbol && "₦"}
      {formatted}
      {showCurrency && " NGN"}
    </span>
  );
}

/**
 * SmartPriceNGN - Forces NGN display regardless of global currency state.
 * Useful for static fee displays or NGN-only contexts.
 */
export function SmartPriceNGN({
  ngnAmount,
  className = "",
  showSymbol = true,
}: {
  ngnAmount: number;
  className?: string;
  showSymbol?: boolean;
}) {
  const formatted = ngnAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (
    <span className={className}>
      {showSymbol && "₦"}
      {formatted}
    </span>
  );
}

/**
 * SmartPriceCrypto - For displaying crypto token values
 */
export function SmartPriceCrypto({
  amount,
  ticker,
  className = "",
}: {
  amount: number;
  ticker: string;
  className?: string;
}) {
  const formatted = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
  return (
    <span className={className}>
      {formatted} {ticker.toUpperCase()}
    </span>
  );
}