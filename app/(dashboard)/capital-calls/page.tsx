"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/context/currency-context";
import {
  CalendarClock,
  Receipt,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Payout {
  id: string;
  propertyId: string;
  amountUSD: string;
  amountNGN: string;
  type: string;
  periodStart: string;
  periodEnd: string;
  distributedAt: string | null;
  status: string;
  property: { title: string } | null;
}

interface Distribution {
  id: string;
  payoutId: string;
  userId: string;
  amountUSD: string;
  amountNGN: string;
  tokens: number;
  distributedAt: string | null;
}

interface CapitalCallsData {
  payouts: Payout[];
  distributions: Distribution[];
  summary: {
    totalDistributed: number;
    pendingAmount: number;
    totalUserReceived: number;
    payoutCount: number;
  };
}

export default function CapitalCallsLedger() {
  const { formatValue } = useCurrency();
  const [data, setData] = useState<CapitalCallsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCapitalCalls() {
      try {
        const res = await fetch("/api/capital-calls");
        if (res.ok) {
          const callsData = await res.json();
          setData(callsData);
        }
      } catch {
        console.error("Failed to fetch capital calls");
      } finally {
        setLoading(false);
      }
    }
    fetchCapitalCalls();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 text-[#E2B93B] animate-spin" />
      </div>
    );
  }

  const summary = data?.summary || {
    totalDistributed: 0,
    pendingAmount: 0,
    totalUserReceived: 0,
    payoutCount: 0,
  };

  const pendingPayouts = (data?.payouts || []).filter(
    (p) => p.status === "PENDING",
  );
  const completedPayouts = (data?.payouts || []).filter(
    (p) => p.status === "DISTRIBUTED",
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      {/* Structural Headers */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
            <CalendarClock className="w-3.5 h-3.5" /> Capital Management
            Framework
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Commitment Calls & Distributions
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track automated drawdown timelines, monitor recurring funding
            streams, and review structured asset payout yields.
          </p>
        </div>
      </div>

      {/* Financial Aggregation Blocks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Total
            Capital Returned
          </span>
          <div className="text-2xl font-extrabold text-white">
            {formatValue(summary.totalUserReceived)}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            Net Aggregated Payouts
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 text-[#E2B93B]" /> Pending
            Distributions
          </span>
          <div className="text-2xl font-extrabold text-[#E2B93B]">
            {formatValue(summary.pendingAmount)}
          </div>
          <span className="text-[9px] text-[#E2B93B] block">
            Awaiting Settlement
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <BarChart2 className="w-3.5 h-3.5 text-blue-400" /> Total Payout
            Events
          </span>
          <div className="text-2xl font-extrabold text-white">
            {summary.payoutCount}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            Completed + Pending
          </span>
        </div>
      </div>

      {/* Interactive Activity Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side - Active Drawdowns + Distribution History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Capital Calls */}
          <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#E2B93B]" /> Active
              Milestone Drawdown Schedules
            </h3>
            {pendingPayouts.length > 0 ? (
              pendingPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className="p-4 rounded-xl bg-[#090A0C] border border-white/5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                    <div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-wide">
                        {payout.status}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">
                        {payout.property?.title || "Unknown Property"}
                      </h4>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        {payout.type} •{" "}
                        {new Date(payout.periodStart).toLocaleDateString()} -{" "}
                        {new Date(payout.periodEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-lg bg-[#13161C]/50 border border-white/5">
                      <span className="text-[10px] text-neutral-500 block uppercase">
                        Total Payout Amount
                      </span>
                      <span className="text-sm font-bold text-white mt-0.5 block">
                        {formatValue(Number(payout.amountNGN))}
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#13161C]/50 border border-white/5">
                      <span className="text-[10px] text-neutral-500 block uppercase">
                        USD Equivalent
                      </span>
                      <span className="text-sm font-bold text-[#E2B93B] mt-0.5 block">
                        ${Number(payout.amountUSD).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <div className="flex items-start gap-2 text-[10px] font-mono text-neutral-400 max-w-md">
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        Fulfilling this capital call ensures continued
                        construction progress and prevents timeline delays.
                      </span>
                    </div>
                    <Button className="bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#B89221] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl px-5 h-10 shadow-lg shrink-0">
                      Fulfill Call Allocation{" "}
                      <ArrowUpRight className="ml-1 w-4 h-4 stroke-[2.5]" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-500 text-xs">
                No pending capital calls. All commitments are up to date.
              </div>
            )}
          </div>

          {/* Completed Distribution History */}
          <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#E2B93B]" /> Distribution Payout
              History
            </h3>
            <div className="space-y-2 font-mono text-xs">
              {completedPayouts.length > 0 ? (
                completedPayouts.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-sans text-xs">
                          {payout.property?.title || "Unknown Property"}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20 font-bold uppercase">
                          SETTLED
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block">
                        {payout.type} •{" "}
                        {payout.distributedAt
                          ? new Date(payout.distributedAt).toLocaleDateString()
                          : "Pending"}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {formatValue(Number(payout.amountNGN))}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  No completed distributions yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Sidebar - User Distributions */}
        <div className="bg-[#0D0E12] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#E2B93B]" /> Your Distributions
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Individual payout allocations based on your token holdings across
            properties.
          </p>

          <div className="p-3.5 rounded-xl bg-[#090A0C] border border-white/5 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Total Received:</span>
              <span className="text-emerald-400 font-bold">
                {formatValue(summary.totalUserReceived)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Pending Payouts:</span>
              <span className="text-[#E2B93B] font-bold">
                {formatValue(summary.pendingAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Distribution Events:</span>
              <span className="text-white font-bold">
                {data?.distributions?.length || 0}
              </span>
            </div>
          </div>

          {/* Recent Individual Distributions */}
          {data?.distributions && data.distributions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                Recent Allocations
              </h4>
              {data.distributions.slice(0, 5).map((dist) => (
                <div
                  key={dist.id}
                  className="p-2.5 rounded-xl bg-[#090A0C]/50 border border-white/5 text-xs font-mono"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">
                      {dist.tokens} tokens
                    </span>
                    <span
                      className={
                        dist.distributedAt
                          ? "text-emerald-400 font-bold"
                          : "text-amber-400 font-bold"
                      }
                    >
                      {formatValue(Number(dist.amountNGN))}
                    </span>
                  </div>
                  <span className="text-[9px] text-neutral-500 block mt-0.5">
                    {dist.distributedAt
                      ? new Date(dist.distributedAt).toLocaleDateString()
                      : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
