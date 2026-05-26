"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Wallet,
  Percent,
  DollarSign,
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";

const stats = [
  {
    label: "Portfolio Value",
    value: 142850,
    change: 24.5,
    icon: DollarSign,
    trend: "up",
  },
  {
    label: "Total Invested",
    value: 115000,
    change: 12.3,
    icon: Building2,
    trend: "up",
  },
  {
    label: "Total Returns",
    value: 27850,
    change: 8.7,
    icon: Wallet,
    trend: "up",
  },
  {
    label: "Avg Yield",
    value: 8.2,
    change: -1.2,
    icon: Percent,
    trend: "down",
    isPercent: true,
  },
];

export function PortfolioOverview() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-5 rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold">
            {stat.isPercent
              ? formatPercent(stat.value)
              : formatCurrency(stat.value)}
          </div>
          <div
            className={`flex items-center gap-1 mt-1 text-sm ${
              stat.trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {stat.trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {stat.change > 0 ? "+" : ""}
              {stat.change}%
            </span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
