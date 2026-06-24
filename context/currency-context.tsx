"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "USD" | "NGN";

interface ExchangeRate {
  usdToNgn: number;
  ngnToUsd: number;
  lastUpdated: string;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: ExchangeRate | null;
  formatAmount: (amountUSD: number, amountNGN?: number) => string;
  formatValue: (amountUSD: number) => string;
  convertAmount: (amountUSD: number) => number;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
  exchangeRate: null,
  formatAmount: () => "",
  formatValue: () => "",
  convertAmount: () => 0,
  loading: true,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("/api/exchange-rate");
        const data = await res.json();
        if (data.success) {
          setExchangeRate({
            usdToNgn: data.usdToNgn,
            ngnToUsd: data.ngnToUsd,
            lastUpdated: data.lastUpdated,
          });
        }
      } catch (err) {
        console.error("Failed to fetch exchange rate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
    // Refresh every 30 minutes
    const interval = setInterval(fetchRate, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const convertAmount = (amountUSD: number): number => {
    if (!exchangeRate) return amountUSD;
    return amountUSD * exchangeRate.usdToNgn;
  };

  const formatAmount = (amountUSD: number, amountNGN?: number): string => {
    if (currency === "NGN") {
      const ngnAmount = amountNGN || convertAmount(amountUSD);
      return `₦${ngnAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amountUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Alias: formatValue is a currency-formatted display alias for formatAmount
  const formatValue = (amountUSD: number): string => {
    return formatAmount(amountUSD);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRate,
        formatAmount,
        formatValue,
        convertAmount,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);