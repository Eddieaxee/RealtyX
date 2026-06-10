"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/context/currency-context";
import { TrendingUp, TrendingDown, RefreshCw, Clock } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  status: string;
  amountUSD: string;
  amountNGN: string;
  tokenAmount: number | null;
  feeUSD: string | null;
  txHash: string | null;
  paymentGateway: string;
  createdAt: string;
  investment: { property: { title: string } | null } | null;
}

interface TransactionData {
  transactions: Transaction[];
}

const typeColors: Record<string, string> = {
  INVESTMENT: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  WITHDRAWAL: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  DEPOSIT: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  PAYOUT: "text-[#E2B93B] bg-[#E2B93B]/10 border-[#E2B93B]/20",
  FEE: "text-neutral-400 bg-neutral-500/10 border-neutral-500/20",
  REFUND: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  TRANSFER: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

const statusColors: Record<string, string> = {
  PENDING: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  CONFIRMED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  FAILED: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  CANCELLED: "text-neutral-400 bg-neutral-500/10 border-neutral-500/20",
};

export default function TransactionsPage() {
  const { formatValue } = useCurrency();
  const [data, setData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/transactions");
        if (res.ok) {
          const txData = await res.json();
          setData(txData);
        }
      } catch {
        console.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 text-[#E2B93B] animate-spin" />
      </div>
    );
  }

  const transactions = data?.transactions || [];
  const filtered =
    filterType === "ALL"
      ? transactions
      : transactions.filter((t) => t.type === filterType);

  const totalInvested = transactions
    .filter((t) => t.type === "INVESTMENT" && t.status === "CONFIRMED")
    .reduce((sum, t) => sum + Number(t.amountNGN), 0);

  const totalWithdrawn = transactions
    .filter((t) => t.type === "WITHDRAWAL" && t.status === "CONFIRMED")
    .reduce((sum, t) => sum + Number(t.amountNGN), 0);

  const pendingCount = transactions.filter(
    (t) => t.status === "PENDING",
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground mt-1">
          View your complete transaction history.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Total
            Invested
          </span>
          <div className="text-2xl font-extrabold text-white">
            {formatValue(totalInvested)}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> Total
            Withdrawn
          </span>
          <div className="text-2xl font-extrabold text-white">
            {formatValue(totalWithdrawn)}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending
          </span>
          <div className="text-2xl font-extrabold text-[#E2B93B]">
            {pendingCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 bg-[#0D0E12] border border-white/5 p-1 rounded-xl font-mono text-xs">
        {["ALL", "INVESTMENT", "WITHDRAWAL", "DEPOSIT", "PAYOUT", "FEE"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg transition-all font-bold ${
                filterType === type
                  ? "bg-white/10 text-white"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              {type}
            </button>
          ),
        )}
      </div>

      {/* Transaction List */}
      <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-2 shadow-xl">
        {filtered.length > 0 ? (
          filtered.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 gap-3 font-mono text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${
                      typeColors[tx.type] ||
                      "text-neutral-400 bg-neutral-500/10 border-neutral-500/20"
                    }`}
                  >
                    {tx.type}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${
                      statusColors[tx.status] ||
                      "text-neutral-400 bg-neutral-500/10 border-neutral-500/20"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 block">
                  {tx.investment?.property?.title || "N/A"} •{" "}
                  {new Date(tx.createdAt).toLocaleDateString()} •{" "}
                  {tx.paymentGateway}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white block">
                  {formatValue(Number(tx.amountNGN))}
                </span>
                {tx.tokenAmount && (
                  <span className="text-[9px] text-neutral-400">
                    {tx.tokenAmount} tokens
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-neutral-500 text-xs">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
}
