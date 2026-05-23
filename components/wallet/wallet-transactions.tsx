"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { formatCurrency, formatDate, truncateAddress } from "@/lib/utils";

const transactions = [
  { id: "1", type: "deposit", amount: 5000, chain: "Ethereum", txHash: "0x742d...5f0b", status: "confirmed", date: "2024-05-20" },
  { id: "2", type: "investment", amount: 2500, chain: "Base", txHash: "0x8ba1...3e8C", status: "confirmed", date: "2024-05-18" },
  { id: "3", type: "payout", amount: 320, chain: "Ethereum", txHash: "0x9cd2...7a1B", status: "confirmed", date: "2024-05-15" },
  { id: "4", type: "withdrawal", amount: 1000, chain: "Base", txHash: "0x3ef5...2c9D", status: "pending", date: "2024-05-14" },
];

export function WalletTransactions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6"
    >
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center gap-4 p-3 rounded-lg bg-background/50">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              tx.type === "deposit" || tx.type === "payout" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            }`}>
              {tx.type === "deposit" || tx.type === "payout" ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize">{tx.type}</span>
                <span className="text-xs text-muted-foreground">{tx.chain}</span>
              </div>
              <div className="text-xs text-muted-foreground">{truncateAddress(tx.txHash)}</div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${tx.type === "deposit" || tx.type === "payout" ? "text-green-500" : "text-red-500"}`}>
                {tx.type === "deposit" || tx.type === "payout" ? "+" : "-"}{formatCurrency(tx.amount)}
              </div>
              <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                {tx.status === "pending" && <Clock className="w-3 h-3" />}
                {formatDate(tx.date)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}