"use client";

import { motion } from "framer-motion";
import { Users, DollarSign, Building2, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

const stats = [
  {
    label: "Total Users",
    value: 52430,
    change: 12.5,
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    label: "Total AUM",
    value: 284500000,
    change: 18.2,
    icon: DollarSign,
    color: "text-[#E2B93B]",
    bgColor: "bg-[#E2B93B]/10",
    borderColor: "border-[#E2B93B]/20",
  },
  {
    label: "Active Properties",
    value: 156,
    change: 8.3,
    icon: Building2,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    label: "Pending KYC",
    value: 234,
    change: -5.1,
    icon: AlertTriangle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
];

export function AdminStats() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12] shadow-xl hover:border-white/10 transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
              {stat.label}
            </span>
            <div className={`w-8 h-8 rounded-xl ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {stat.label === "Total AUM" ? formatCurrency(stat.value) : formatNumber(stat.value)}
          </div>
          <div className={`flex items-center gap-1 mt-2 text-xs font-mono font-bold ${stat.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {stat.change >= 0 ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{Math.abs(stat.change)}%</span>
            <span className="text-neutral-600 font-normal">vs last month</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}