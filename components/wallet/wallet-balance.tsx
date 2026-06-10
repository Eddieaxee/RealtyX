"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  Copy,
  Check,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/currency-context";

interface WalletData {
  id: string;
  address: string;
  chain: string;
  chainId: number;
  balance: string;
  isPrimary: boolean;
  isVerified: boolean;
}

export function WalletBalance() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { formatValue } = useCurrency();

  useEffect(() => {
    async function fetchWallets() {
      try {
        const res = await fetch("/api/wallet", { method: "GET" });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          setWallets(data);
        }
      } catch {
        // Fall back to empty state
      } finally {
        setLoading(false);
      }
    }
    fetchWallets();
  }, []);

  const totalBalance = wallets.reduce(
    (sum, w) => sum + (parseFloat(w.balance) || 0),
    0,
  );

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
      className="rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md p-6 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#E2B93B] to-[#B89221] flex items-center justify-center shadow-lg shadow-[#E2B93B]/10">
            <Wallet className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
              Net Asset Value
            </h2>
            <p className="text-xs text-neutral-500">
              Aggregated allocation capital balances
            </p>
          </div>
        </div>
        <div className="sm:text-right">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {formatValue(totalBalance)}
          </div>
          <div className="flex items-center sm:justify-end gap-1 text-xs font-mono text-emerald-400 mt-0.5">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            Connected Wallets
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {wallets.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#13161C]/50 border border-white/5 text-center">
            <p className="text-xs text-neutral-400">
              No wallets connected yet. Use the Web3 connector to link your
              wallet.
            </p>
          </div>
        ) : (
          wallets.map((wallet, idx) => (
            <div
              key={wallet.id}
              className="p-4 rounded-xl bg-[#13161C]/50 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/10 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {wallet.chain}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    {`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                  </span>
                  <button
                    onClick={() => handleCopy(wallet.address, idx)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    title="Copy Ledger Address"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  {wallet.isVerified && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      VERIFIED
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold font-mono text-neutral-300">
                  {parseFloat(wallet.balance).toLocaleString(undefined, {
                    maximumFractionDigits: 8,
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                <div className="sm:text-right">
                  <div className="text-sm font-bold font-mono text-white">
                    {formatValue(parseFloat(wallet.balance) || 0)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs bg-[#0D0E12] border-white/5 hover:bg-[#13161C] hover:text-white rounded-lg px-3"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1 text-neutral-500" />{" "}
                  Scan
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
