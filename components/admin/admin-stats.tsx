"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, Building2, AlertTriangle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

const stats = [
  { label: "Total Users", value: 52430, change: 12.5, icon: Users },
  { label: "Total AUM", value: 284500000, change: 18.2, icon: DollarSign },
  { label: "Active Properties", value: 156, change: 8.3, icon: Building2 },
  { label: "Pending KYC", value: 234, change: -5.1, icon: AlertTriangle },
];

export function AdminStats() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="p-5 rounded-xl border border-border/50 bg-card/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold">
            {stat.label === "Total AUM" ? formatCurrency(stat.value) : formatNumber(stat.value)}
          </div>
          <div className={`text-sm mt-1 ${stat.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {stat.change > 0 ? "+" : ""}{stat.change}% vs last month
          </div>
        </motion.div>
      ))}
    </div>
  );
}