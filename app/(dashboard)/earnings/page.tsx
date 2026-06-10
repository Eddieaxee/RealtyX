"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/context/currency-context";
import {
  DollarSign,
  TrendingUp,
  Clock,
  BarChart3,
  Wallet,
  RefreshCw,
} from "lucide-react";

interface Distribution {
  id: string;
  amountUSD: string;
  amountNGN: string;
  tokens: number;
  txHash: string | null;
  distributedAt: string | null;
  createdAt: string;
}

interface EarningsSummary {
  totalEarnedUSD: number;
  totalEarnedNGN: number;
  pendingEarningsUSD: number;
  pendingEarningsNGN: number;
  distributionCount: number;
  investmentCount: number;
}

interface MonthlyEarning {
  month: string;
  usd: number;
  ngn: number;
}

interface PropertyEarning {
  title: string;
  usd: number;
  ngn: number;
  tokens: number;
}

interface EarningsData {
  distributions: Distribution[];
  summary: EarningsSummary;
  monthlyEarnings: MonthlyEarning[];
  earningsByProperty: PropertyEarning[];
}

export default function EarningsPage() {
  const { formatValue } = useCurrency();
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch("/api/earnings");
        if (res.ok) {
          const earningsData = await res.json();
          setData(earningsData);
        }
      } catch {
        console.error("Failed to fetch earnings");
      } finally {
        setLoading(false);
      }
    }
    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 text-[#E2B93B] animate-spin" />
      </div>
    );
  }

  const summary = data?.summary || {
    totalEarnedUSD: 0,
    totalEarnedNGN: 0,
    pendingEarningsUSD: 0,
    pendingEarningsNGN: 0,
    distributionCount: 0,
    investmentCount: 0,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
            <DollarSign className="w-3.5 h-3.5" /> Yield & Returns Dashboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Earnings Overview
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track rental yields, capital appreciation, and dividend
            distributions across your portfolio.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Total Earned
          </span>
          <div className="text-2xl font-extrabold text-white">
            {formatValue(summary.totalEarnedNGN)}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            ≈ ${summary.totalEarnedUSD.toLocaleString()} USD
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending Earnings
          </span>
          <div className="text-2xl font-extrabold text-[#E2B93B]">
            {formatValue(summary.pendingEarningsNGN)}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            Awaiting distribution
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" /> Total
            Distributions
          </span>
          <div className="text-2xl font-extrabold text-white">
            {summary.distributionCount}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            Payout events received
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-[#E2B93B]" /> Active Investments
          </span>
          <div className="text-2xl font-extrabold text-white">
            {summary.investmentCount}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            Generating returns
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side - Distribution History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#E2B93B]" /> Distribution
              History
            </h3>
            {data?.distributions && data.distributions.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {data.distributions.map((dist) => (
                  <div
                    key={dist.id}
                    className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-sans text-xs">
                          Distribution #{dist.id.slice(-6).toUpperCase()}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${
                            dist.distributedAt
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {dist.distributedAt ? "SETTLED" : "PENDING"}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block">
                        {dist.tokens} tokens •{" "}
                        {new Date(dist.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {formatValue(Number(dist.amountNGN))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 text-xs">
                No distributions yet. Earnings will appear here once payouts are
                distributed.
              </div>
            )}
          </div>

          {/* Monthly Earnings Chart */}
          <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#E2B93B]" /> Monthly Earnings
            </h3>
            {data?.monthlyEarnings && data.monthlyEarnings.length > 0 ? (
              <div className="space-y-2">
                {data.monthlyEarnings.map((month) => (
                  <div
                    key={month.month}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 font-mono text-xs"
                  >
                    <span className="text-neutral-400">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-emerald-400 font-bold">
                        {formatValue(month.ngn)}
                      </span>
                      <span className="text-neutral-500">
                        ${month.usd.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500 text-xs">
                Monthly breakdown will appear as distributions are received.
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Earnings by Property */}
        <div className="bg-[#0D0E12] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#E2B93B]" /> Earnings by
            Property
          </h3>
          {data?.earningsByProperty && data.earningsByProperty.length > 0 ? (
            <div className="space-y-3">
              {data.earningsByProperty.map((prop, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-[#090A0C] border border-white/5 space-y-2 font-mono text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-white font-bold font-sans text-xs max-w-[60%] truncate">
                      {prop.title}
                    </span>
                    <span className="text-[#E2B93B] font-bold text-[10px]">
                      {prop.tokens} tokens
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Total Earned:</span>
                    <span className="text-emerald-400 font-bold">
                      {formatValue(prop.ngn)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <style jsx>{`
                      .progress-fill-${i} {
                        width: ${Math.min(
                          100,
                          Math.round(
                            (prop.ngn / (summary.totalEarnedNGN || 1)) * 100,
                          ),
                        )}%;
                      }
                    `}</style>
                    <div
                      className={`h-full bg-gradient-to-r from-[#E2B93B] to-[#B89221] rounded-full progress-fill progress-fill-${i}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs">
              Property-level breakdown will appear once you have active
              investments with distributions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
