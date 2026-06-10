"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight, BarChart2 } from "lucide-react";

const insights = [
  { market: "Lagos Residential Yield Index", change: 18.2, trend: "up" },
  { market: "Abuja Grade-A Commercial", change: 14.5, trend: "up" },
  { market: "Lekki Logistics Asset Hubs", change: 22.1, trend: "up" },
  { market: "Core Urban Retail Sector", change: -2.4, trend: "down" },
];

export function MarketInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md p-6 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-4 h-4 text-[#E2B93B]" />
        <h2 className="text-base font-bold text-white tracking-tight">Macro Market Visualizer</h2>
      </div>
      <div className="space-y-2">
        {insights.map((insight) => (
          <div
            key={insight.market}
            className="flex items-center justify-between p-3 rounded-xl bg-[#13161C]/30 border border-white/5 hover:bg-[#13161C]/50 transition-colors"
          >
            <span className="text-xs font-medium text-neutral-300 max-w-[180px] truncate">{insight.market}</span>
            <div className={`flex items-center gap-1 text-xs font-mono font-bold ${
              insight.trend === "up" ? "text-emerald-400" : "text-red-400"
            }`}>
              {insight.trend === "up" ? (
                <TrendingUp className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <TrendingDown className="w-3 h-3 stroke-[2.5]" />
              )}
              {insight.change > 0 ? "+" : ""}{insight.change}%
              <ArrowUpRight className="w-2.5 h-2.5 opacity-40 ml-0.5" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}