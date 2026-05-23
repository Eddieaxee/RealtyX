"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

const investments = [
  { id: "1", property: "Manhattan Penthouse", location: "New York, USA", tokens: 450, amount: 45000, date: "2024-05-15", status: "Active", return: 14.2 },
  { id: "2", property: "Miami Beachfront Villa", location: "Miami, USA", tokens: 640, amount: 32000, date: "2024-04-22", status: "Active", return: 18.5 },
  { id: "3", property: "Berlin Tech Office", location: "Berlin, Germany", tokens: 240, amount: 18000, date: "2024-03-10", status: "Active", return: 11.8 },
  { id: "4", property: "Tokyo Shibuya Tower", location: "Tokyo, Japan", tokens: 120, amount: 15000, date: "2024-02-28", status: "Active", return: 9.3 },
];

export function RecentInvestments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Recent Investments</h2>
        <Link href="/portfolio">
          <Button variant="ghost" size="sm" className="group">
            View All
            <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {investments.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-background transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{inv.property}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                {inv.location}
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <div className="font-medium">{formatCurrency(inv.amount)}</div>
              <div className="text-sm text-muted-foreground">{inv.tokens} tokens</div>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-green-500">+{inv.return}%</div>
              <div className="text-xs text-muted-foreground">{formatDate(inv.date)}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}