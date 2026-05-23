"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, truncateAddress } from "@/lib/utils";

const transactions = [
  { id: "1", type: "investment", property: "Manhattan Penthouse", amount: 45000, tokens: 450, date: "2024-05-20", status: "confirmed", txHash: "0x742d...5f0b" },
  { id: "2", type: "investment", property: "Miami Beachfront", amount: 32000, tokens: 640, date: "2024-05-18", status: "confirmed", txHash: "0x8ba1...3e8C" },
  { id: "3", type: "payout", property: "Manhattan Penthouse", amount: 850, tokens: 0, date: "2024-05-15", status: "confirmed", txHash: "0x9cd2...7a1B" },
  { id: "4", type: "deposit", property: "Wallet Funding", amount: 5000, tokens: 0, date: "2024-05-14", status: "confirmed", txHash: "0x3ef5...2c9D" },
  { id: "5", type: "investment", property: "Berlin Tech Office", amount: 18000, tokens: 240, date: "2024-05-10", status: "confirmed", txHash: "0x1ab4...9f2E" },
  { id: "6", type: "payout", property: "Miami Beachfront", amount: 420, tokens: 0, date: "2024-05-08", status: "confirmed", txHash: "0x7cd3...4b8A" },
];

export function TransactionList() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">All Transactions</h2>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Property</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Tokens</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Transaction</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-border/30 hover:bg-background/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      tx.type === "investment" || tx.type === "deposit" ? "bg-green-500/10" : "bg-red-500/10"
                    }`}>
                      {tx.type === "investment" || tx.type === "deposit" ? (
                        <ArrowDownRight className="w-3 h-3 text-green-500" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                    <span className="text-sm capitalize">{tx.type}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">{tx.property}</td>
                <td className="py-3 px-4 text-sm font-medium">
                  <span className={tx.type === "investment" || tx.type === "deposit" ? "text-green-500" : "text-red-500"}>
                    {tx.type === "investment" || tx.type === "deposit" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm hidden sm:table-cell">{tx.tokens > 0 ? `${tx.tokens}` : "-"}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{truncateAddress(tx.txHash)}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(tx.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}