"use client";

import { motion } from "framer-motion";
import { Wallet, Shield, Zap } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnect() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md p-6 space-y-6 shadow-xl"
    >
      <div>
        <h2 className="text-base font-bold text-white tracking-tight">On-Chain Interface</h2>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
          Establish cryptographic link parameters with Web3 signatures to authorize fractional acquisitions.
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#13161C]/50 border border-white/5">
          <Shield className="w-4 h-4 text-[#E2B93B] shrink-0" />
          <div className="text-xs text-neutral-300 font-medium">Secured Encrypted Execution</div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#13161C]/50 border border-white/5">
          <Zap className="w-4 h-4 text-[#E2B93B] shrink-0" />
          <div className="text-xs text-neutral-300 font-medium">Instant Contract Minting</div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#13161C]/50 border border-white/5">
          <Wallet className="w-4 h-4 text-[#E2B93B] shrink-0" />
          <div className="text-xs text-neutral-300 font-medium">Ethereum & Base Support</div>
        </div>
      </div>

      <div className="pt-2 w-full custom-rainbowkit-wrapper">
        <ConnectButton showBalance={false} label="Establish Web3 Link" />
      </div>
    </motion.div>
  );
}