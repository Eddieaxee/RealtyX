"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type CurrencyMode = "NGN" | "USD";

interface CurrencyContextType {
  currency: CurrencyMode;
  exchangeRate: number; // 1 USD to NGN
  setCurrency: (mode: CurrencyMode) => void;
  formatValue: (
    amountInUSD: number,
    options?: { noSymbol?: boolean; digits?: number },
  ) => string;
  convertValue: (amountInUSD: number) => number;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

const DEFAULT_EXCHANGE_RATE = 1520; // Fallback rate

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyMode>("USD");
  const [exchangeRate, setExchangeRate] = useState<number>(
    DEFAULT_EXCHANGE_RATE,
  );
  const [loading, setLoading] = useState(true);

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("realtyx_currency_preference");
    if (saved === "NGN" || saved === "USD") {
      setCurrencyState(saved);
    }
  }, []);

  // Fetch live exchange rate from API
  useEffect(() => {
    let alive = true;

    async function fetchRate() {
      try {
        const res = await fetch("/api/exchange-rate");
        if (!res.ok) return;
        const data = await res.json();
        if (
          alive &&
          data?.rate &&
          typeof data.rate === "number" &&
          data.rate > 0
        ) {
          setExchangeRate(data.rate);
        }
      } catch {
        // Use default rate on failure
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchRate();

    // Refresh rate every 30 minutes
    const interval = setInterval(fetchRate, 30 * 60 * 1000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  const handleCurrencyChange = useCallback((mode: CurrencyMode) => {
    setCurrencyState(mode);
    localStorage.setItem("realtyx_currency_preference", mode);
  }, []);

  // Keep currency synced with PublicNav in other windows/tabs
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => {
      const saved = window.localStorage.getItem("realtyx_currency_preference");
      if (saved === "NGN" || saved === "USD") {
        setCurrencyState(saved);
      }
    };

    window.addEventListener("realtyx_currency_changed", handler);
    return () =>
      window.removeEventListener("realtyx_currency_changed", handler);
  }, []);

  // All values are stored in USD internally
  const convertValue = useCallback(
    (amountInUSD: number) => {
      if (currency === "NGN") return amountInUSD * exchangeRate;
      return amountInUSD;
    },
    [currency, exchangeRate],
  );

  const formatValue = useCallback(
    (
      amountInUSD: number | undefined | null,
      options?: { noSymbol?: boolean; digits?: number },
    ) => {
      const safeAmount =
        typeof amountInUSD === "number" && isFinite(amountInUSD)
          ? amountInUSD
          : 0;
      const converted = convertValue(safeAmount);
      const digits =
        options?.digits !== undefined
          ? options.digits
          : currency === "USD"
            ? 2
            : 0;

      const formattedNumber = (converted || 0).toLocaleString("en-NG", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });

      if (options?.noSymbol) return formattedNumber;
      return currency === "NGN"
        ? `\u20A6${formattedNumber}`
        : `$${formattedNumber}`;
    },
    [currency, convertValue],
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        exchangeRate,
        setCurrency: handleCurrencyChange,
        formatValue,
        convertValue,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context)
    throw new Error(
      "useCurrency must be executed inside a CurrencyProvider block.",
    );
  return context;
}
