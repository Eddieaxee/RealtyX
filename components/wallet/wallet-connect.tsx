"use client";

import { motion } from "framer-motion";
import { Wallet, Shield, Zap } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";

export function WalletConnect() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-6"
    >
      <div>
        <h2 className="text-lg font-semibold mb-2">Connect Wallet</h2>
        <p className="text-sm text-muted-foreground">Link your Web3 wallet to start investing.</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
          <Shield className="w-5 h-5 text-gold-500" />
          <div className="text-sm">Bank-grade security</div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
          <Zap className="w-5 h-5 text-gold-500" />
          <div className="text-sm">Instant transactions</div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
          <Wallet className="w-5 h-5 text-gold-500" />
          <div className="text-sm">Multi-chain support</div>
        </div>
      </div>

      <ConnectButton showBalance={false} />
    </motion.div>
  );
}