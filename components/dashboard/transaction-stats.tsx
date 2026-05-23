"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Wallet, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const stats = [
  { label: "Total Invested", value: 125000, icon: ArrowDownRight, color: "text-green-500", bgColor: "bg-green-500/10" },
  { label: "Total Returns", value: 28450, icon: ArrowUpRight, color: "text-gold-500", bgColor: "bg-gold-500/10" },
  { label: "Net Deposits", value: 50000, icon: Wallet, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { label: "Pending", value: 1200, icon: PiggyBank, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
];

export function TransactionStats() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-5 rounded-xl border border-border/50 bg-card/50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(stat.value)}</div>
        </motion.div>
      ))}
    </div>
  );
}