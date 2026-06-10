"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Wallet,
  Percent,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useCurrency } from "@/context/currency-context";
import { useEffect, useState } from "react";

interface PortfolioData {
  totalInvestments: number;
  totalValue: number;
  totalYield: number;
  avgYield: number;
  investmentCount: number;
}

export function PortfolioOverview() {
  const { formatValue } = useCurrency();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/investments");
        if (res.ok) {
          const investments = await res.json();
          if (Array.isArray(investments) && investments.length > 0) {
            const totalInvested = investments.reduce(
              (sum: number, inv: { amountUSD?: number }) =>
                sum + (inv.amountUSD || 0),
              0,
            );
            setData({
              totalInvestments: totalInvested,
              totalValue: totalInvested * 1.18, // 18% appreciation
              totalYield: totalInvested * 0.12, // 12% yield
              avgYield: 12.5,
              investmentCount: investments.length,
            });
          } else {
            setData({
              totalInvestments: 0,
              totalValue: 0,
              totalYield: 0,
              avgYield: 0,
              investmentCount: 0,
            });
          }
        }
      } catch {
        // Use default empty state
        setData({
          totalInvestments: 0,
          totalValue: 0,
          totalYield: 0,
          avgYield: 0,
          investmentCount: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  const stats = [
    {
      label: "Portfolio Value",
      value: data?.totalValue ?? 0,
      change: data && data.totalValue > 0 ? 18.4 : 0,
      icon: BarChart3,
      trend: "up" as const,
    },
    {
      label: "Total Invested",
      value: data?.totalInvestments ?? 0,
      change: data && data.totalInvestments > 0 ? 12.5 : 0,
      icon: Building2,
      trend: "up" as const,
    },
    {
      label: "Accrued Yield",
      value: data?.totalYield ?? 0,
      change: data && data.totalYield > 0 ? 6.2 : 0,
      icon: Wallet,
      trend: "up" as const,
    },
    {
      label: "Average Yield",
      value: data?.avgYield ?? 0,
      change: data && data.avgYield > 0 ? -0.4 : 0,
      icon: Percent,
      trend: "down" as const,
      isPercent: true,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md"
          >
            <div className="flex items-center justify-center h-20">
              <Loader2 className="w-5 h-5 text-[#E2B93B] animate-spin" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md hover:border-white/10 transition-all duration-200 shadow-xl group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 group-hover:text-neutral-300 transition-colors">
              {stat.label}
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#E2B93B]/5 border border-[#E2B93B]/10 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-[#E2B93B]" />
            </div>
          </div>

          <div className="text-2xl font-bold font-mono tracking-tight text-white">
            {stat.isPercent ? `${stat.value}%` : formatValue(stat.value)}
          </div>

          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium">
            <div
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                stat.trend === "up"
                  ? "bg-emerald-500/5 text-emerald-400"
                  : "bg-red-500/5 text-red-400"
              }`}
            >
              {stat.trend === "up" ? (
                <TrendingUp className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <TrendingDown className="w-3 h-3 stroke-[2.5]" />
              )}
              <span>
                {stat.change > 0 ? "+" : ""}
                {stat.change}%
              </span>
            </div>
            <span className="text-neutral-500">vs baseline</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
