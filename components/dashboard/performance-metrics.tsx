"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, Clock, Shield } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";

const metrics = [
  { label: "Total Return", value: 28450, target: 30000, icon: TrendingUp, color: "text-green-500" },
  { label: "Target Progress", value: 68, target: 100, icon: Target, color: "text-gold-500", isPercent: true },
  { label: "Avg Hold Time", value: 8.5, target: 12, icon: Clock, color: "text-blue-500", suffix: "months" },
  { label: "Risk Score", value: 3.2, target: 5, icon: Shield, color: "text-purple-500", suffix: "/5" },
];

export function PerformanceMetrics() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-5 rounded-xl border border-border/50 bg-card/50"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{metric.label}</span>
            <metric.icon className={`w-5 h-5 ${metric.color}`} />
          </div>
          <div className="text-2xl font-bold mb-2">
            {metric.isPercent ? formatPercent(metric.value) : metric.suffix ? `${metric.value}${metric.suffix}` : formatCurrency(metric.value)}
          </div>
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(metric.value / metric.target) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full gradient-gold"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round((metric.value / metric.target) * 100)}%</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}