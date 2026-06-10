"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";
import { useCurrency } from "@/context/currency-context";

interface TransactionData {
  id: string;
  type: string;
  status: string;
  amountNGN: string;
  amountUSD: string;
  paymentGateway: string;
  txHash?: string | null;
  createdAt: string;
}

export function WalletTransactions() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatValue } = useCurrency();

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/investments", { method: "GET" });
        if (!res.ok) return;
        const data = await res.json();
        // Investments include transactions via the investment relation
        if (Array.isArray(data)) {
          const txs: TransactionData[] = [];
          for (const inv of data) {
            if (inv.transactions && Array.isArray(inv.transactions)) {
              for (const tx of inv.transactions) {
                txs.push({
                  id: tx.id,
                  type: tx.type || inv.status,
                  status: tx.status,
                  amountNGN: tx.amountNGN || "0",
                  amountUSD: tx.amountUSD || "0",
                  paymentGateway: tx.paymentGateway || "BLOCKCHAIN",
                  txHash: tx.txHash,
                  createdAt: tx.createdAt,
                });
              }
            }
          }
          // Also try to fetch wallet-level transactions
          try {
            const walletRes = await fetch("/api/wallet", { method: "GET" });
            if (walletRes.ok) {
              const wallets = await walletRes.json();
              if (Array.isArray(wallets)) {
                for (const wallet of wallets) {
                  if (
                    wallet.transactions &&
                    Array.isArray(wallet.transactions)
                  ) {
                    for (const tx of wallet.transactions) {
                      if (!txs.find((t) => t.id === tx.id)) {
                        txs.push({
                          id: tx.id,
                          type: tx.type,
                          status: tx.status,
                          amountNGN: tx.amountNGN || "0",
                          amountUSD: tx.amountUSD || "0",
                          paymentGateway: tx.paymentGateway || "BLOCKCHAIN",
                          txHash: tx.txHash,
                          createdAt: tx.createdAt,
                        });
                      }
                    }
                  }
                }
              }
            }
          } catch {
            // Ignore wallet fetch errors
          }
          txs.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          setTransactions(txs);
        }
      } catch {
        // Fall back to empty state
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const isInflow = (type: string) =>
    type === "DEPOSIT" || type === "PAYOUT" || type === "REFUND";

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md p-6 shadow-xl"
      >
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#E2B93B] animate-spin" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md p-6 shadow-xl"
    >
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-4 h-4 text-[#E2B93B]" />
        <h2 className="text-base font-bold text-white tracking-tight">
          Recent Activity History
        </h2>
      </div>

      <div className="space-y-2.5">
        {transactions.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#13161C]/50 border border-white/5 text-center">
            <p className="text-xs text-neutral-400">
              No transactions yet. Your investment activity will appear here.
            </p>
          </div>
        ) : (
          transactions.slice(0, 10).map((tx) => {
            const inflow = isInflow(tx.type);
            const amountNum = parseFloat(tx.amountNGN) || 0;
            const dateStr = new Date(tx.createdAt).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#13161C]/50 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      inflow
                        ? "bg-emerald-500/5 text-emerald-400 border border-emerald-500/10"
                        : "bg-rose-500/5 text-rose-400 border border-rose-500/10"
                    }`}
                  >
                    {inflow ? (
                      <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">
                        {tx.type.replace("_", " ")}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                        {tx.paymentGateway}
                      </span>
                    </div>
                    {tx.txHash && (
                      <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">
                        {tx.txHash.length > 20
                          ? `${tx.txHash.slice(0, 10)}...${tx.txHash.slice(-6)}`
                          : tx.txHash}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-xs font-bold font-mono ${inflow ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {inflow ? "+" : "-"}
                    {formatValue(amountNum)}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-neutral-500 mt-0.5">
                    {tx.status === "PENDING" && (
                      <Clock className="w-3 h-3 text-[#E2B93B]" />
                    )}
                    <span>{dateStr}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
