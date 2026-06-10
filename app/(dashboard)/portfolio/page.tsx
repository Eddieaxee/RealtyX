"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/context/currency-context";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  RefreshCw,
  Building2,
} from "lucide-react";

interface Investment {
  id: string;
  propertyId: string;
  tokens: number;
  amountUSD: string;
  amountNGN: string;
  tokenPriceUSD: string;
  status: string;
  createdAt: string;
  property: {
    title: string;
    type: string;
    tokenPriceNGN: string;
    expectedReturn: string | null;
    rentalYield: string | null;
  } | null;
}

interface PortfolioData {
  investments: Investment[];
}

export default function PortfolioPage() {
  const { formatValue } = useCurrency();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/investments");
        if (res.ok) {
          const portfolioData = await res.json();
          setData(portfolioData);
        }
      } catch {
        console.error("Failed to fetch portfolio");
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 text-[#E2B93B] animate-spin" />
      </div>
    );
  }

  const investments = data?.investments || [];
  const totalInvestedNGN = investments.reduce(
    (sum, inv) => sum + Number(inv.amountNGN),
    0,
  );
  const totalTokens = investments.reduce((sum, inv) => sum + inv.tokens, 0);
  const confirmedInvestments = investments.filter(
    (inv) => inv.status === "CONFIRMED",
  );

  // Group by property
  const byProperty: Record<
    string,
    {
      title: string;
      type: string;
      tokens: number;
      amountNGN: number;
      expectedReturn: number | null;
    }
  > = {};
  for (const inv of investments) {
    const pid = inv.propertyId;
    if (!byProperty[pid]) {
      byProperty[pid] = {
        title: inv.property?.title || "Unknown",
        type: inv.property?.type || "UNKNOWN",
        tokens: 0,
        amountNGN: 0,
        expectedReturn: inv.property?.expectedReturn
          ? Number(inv.property.expectedReturn)
          : null,
      };
    }
    byProperty[pid].tokens += inv.tokens;
    byProperty[pid].amountNGN += Number(inv.amountNGN);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground mt-1">
          Track your investments and performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[#E2B93B]" /> Total Invested
          </span>
          <div className="text-2xl font-extrabold text-white">
            {formatValue(totalInvestedNGN)}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            Across {investments.length} investments
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" /> Total Tokens
          </span>
          <div className="text-2xl font-extrabold text-white">
            {totalTokens.toLocaleString()}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            Fractional certificates
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Confirmed
          </span>
          <div className="text-2xl font-extrabold text-emerald-400">
            {confirmedInvestments.length}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            Active holdings
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-purple-400" /> Properties
          </span>
          <div className="text-2xl font-extrabold text-white">
            {Object.keys(byProperty).length}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            Unique assets
          </span>
        </div>
      </div>

      {/* Portfolio Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#E2B93B]" /> Investment
            Holdings
          </h3>
          {confirmedInvestments.length > 0 ? (
            <div className="space-y-2 font-mono text-xs">
              {confirmedInvestments.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-sans text-xs">
                        {inv.property?.title || "Unknown Property"}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 font-bold uppercase">
                        {inv.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 block">
                      {inv.tokens.toLocaleString()} tokens •{" "}
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white block">
                      {formatValue(Number(inv.amountNGN))}
                    </span>
                    {inv.property?.expectedReturn && (
                      <span className="text-[9px] text-emerald-400">
                        +{inv.property.expectedReturn}% expected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No confirmed investments yet. Start investing to build your
              portfolio.
            </div>
          )}
        </div>

        {/* Asset Breakdown Sidebar */}
        <div className="bg-[#0D0E12] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#E2B93B]" /> Asset Allocation
          </h3>
          {Object.keys(byProperty).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(byProperty).map(([pid, prop]) => {
                const allocation =
                  totalInvestedNGN > 0
                    ? (prop.amountNGN / totalInvestedNGN) * 100
                    : 0;
                return (
                  <div
                    key={pid}
                    className="p-3.5 rounded-xl bg-[#090A0C] border border-white/5 space-y-2 font-mono text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-white font-bold font-sans text-xs max-w-[60%] truncate">
                        {prop.title}
                      </span>
                      <span className="text-[#E2B93B] font-bold text-[10px]">
                        {allocation.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">
                        {prop.tokens.toLocaleString()} tokens
                      </span>
                      <span className="text-white font-bold">
                        {formatValue(prop.amountNGN)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-[#E2B93B] to-[#B89221] rounded-full w-[${allocation}%]`}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-neutral-500">
                      <span>Type: {prop.type}</span>
                      {prop.expectedReturn && (
                        <span className="text-emerald-400">
                          +{prop.expectedReturn}% return
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs">
              Asset allocation will appear once you have investments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
