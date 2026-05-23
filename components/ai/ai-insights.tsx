"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    title: "Portfolio Optimization",
    description: "Your residential allocation is 15% above target. Consider rebalancing into commercial assets.",
    type: "opportunity",
  },
  {
    icon: AlertTriangle,
    title: "Risk Alert",
    description: "APAC exposure increased to 35% due to market volatility. Monitor closely or hedge.",
    type: "warning",
  },
  {
    icon: Lightbulb,
    title: "AI Recommendation",
    description: "Dubai Marina showing 23% YoY growth. Strong buy signal based on momentum indicators.",
    type: "recommendation",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "You are 68% toward your $200K portfolio goal. On track to reach target by Q4 2024.",
    type: "progress",
  },
];

export function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold">AI Insights</h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.title}
            className={`p-4 rounded-lg border ${
              insight.type === "warning"
                ? "border-yellow-500/20 bg-yellow-500/5"
                : insight.type === "opportunity"
                ? "border-green-500/20 bg-green-500/5"
                : "border-border/50 bg-background/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                insight.type === "warning"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : insight.type === "opportunity"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-primary/10 text-primary"
              }`}>
                <insight.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">{insight.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}