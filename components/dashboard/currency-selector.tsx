"use client";

import { useCurrency } from "@/context/currency-context";

export function CurrencySelectorToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-1 bg-[#090A0C] border border-white/5 p-1 rounded-xl w-fit">
      <button
        onClick={() => setCurrency("NGN")}
        className={`px-3 py-1 text-[10px] font-mono font-extrabold uppercase rounded-lg transition-all ${currency === "NGN" ? "bg-[#E2B93B] text-black" : "text-neutral-500 hover:text-neutral-300"}`}
      >
        NGN (₦)
      </button>
      <button
        onClick={() => setCurrency("USD")}
        className={`px-3 py-1 text-[10px] font-mono font-extrabold uppercase rounded-lg transition-all ${currency === "USD" ? "bg-[#E2B93B] text-black" : "text-neutral-500 hover:text-neutral-300"}`}
      >
        USD ($)
      </button>
    </div>
  );
}