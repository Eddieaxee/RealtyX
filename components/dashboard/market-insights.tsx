"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";

const insights = [
  { market: "US Residential", change: 5.2, trend: "up" },
  { market: "EU Commercial", change: 3.8, trend: "up" },
  { market: "APAC Mixed", change: -1.2, trend: "down" },
  { market: "Global REITs", change: 7.1, trend: "up" },
];

export function MarketInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6"
    >
      <h2 className="text-lg font-semibold mb-4">Market Insights</h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.market}
            className="flex items-center justify-between p-3 rounded-lg bg-background/50"
          >
            <span className="text-sm font-medium">{insight.market}</span>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              insight.trend === "up" ? "text-green-500" : "text-red-500"
            }`}>
              {insight.trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {insight.change > 0 ? "+" : ""}{insight.change}%
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}