"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, truncateAddress } from "@/lib/utils";

const wallets = [
  {
    chain: "Ethereum",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    balance: 45230.5,
    usdValue: 45230.5,
    change: 12.5,
  },
  {
    chain: "Base",
    address: "0x8ba1f109551bD432803012645Hac136c82C3e8C9",
    balance: 12800.0,
    usdValue: 12800.0,
    change: 8.3,
  },
];

export function WalletBalance() {
  const totalBalance = wallets.reduce((sum, w) => sum + w.usdValue, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Total Balance</h2>
            <p className="text-sm text-muted-foreground">
              Across all connected wallets
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">
            {formatCurrency(totalBalance)}
          </div>
          <div className="flex items-center justify-end gap-1 text-sm text-green-500">
            <ArrowUpRight className="w-4 h-4" />
            +10.8% this month
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {wallets.map((wallet) => (
          <div key={wallet.chain} className="p-4 rounded-lg bg-background/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{wallet.chain}</span>
                <span className="text-xs text-muted-foreground">
                  {truncateAddress(wallet.address)}
                </span>
                <button
                  className="p-1 rounded hover:bg-muted transition-colors"
                  title="Copy address"
                  aria-label="Copy address"
                >
                  <Copy className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${wallet.change >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {wallet.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {wallet.change > 0 ? "+" : ""}
                {wallet.change}%
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">
                {formatCurrency(wallet.usdValue)}
              </div>
              <Button variant="ghost" size="sm" className="h-8">
                <ExternalLink className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
