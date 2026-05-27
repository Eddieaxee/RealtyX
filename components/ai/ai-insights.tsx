"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  Loader2,
} from "lucide-react";

// Map string keys from the API to your actual Lucide Icon components
const iconMap = {
  opportunity: TrendingUp,
  warning: AlertTriangle,
  recommendation: Lightbulb,
  progress: Target,
};

interface InsightItem {
  title: string;
  description: string;
  type: "opportunity" | "warning" | "recommendation" | "progress";
}

export function AIInsights() {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true);
        const response = await fetch("/api/ai/insights");
        if (!response.ok) throw new Error("Failed to load insights");

        const data = await response.json();
        setInsights(data.insights);
      } catch (err) {
        console.error("Error fetching AI insights:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/50 p-6 flex flex-col items-center justify-center min-h-[300px] space-y-3">
        <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
        <p className="text-xs text-muted-foreground">
          Running AI portfolio diagnostics...
        </p>
      </div>
    );
  }

  if (error || insights.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/50 p-6 text-center text-xs text-muted-foreground">
        Unable to load live optimization suggestions at this time.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold">AI Insights</h2>
      <div className="space-y-3">
        {insights.map((insight) => {
          // Dynamic icon lookups safely mapping keys to visual lucide components
          const IconComponent = iconMap[insight.type] || Lightbulb;

          return (
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
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    insight.type === "warning"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : insight.type === "opportunity"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">{insight.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
