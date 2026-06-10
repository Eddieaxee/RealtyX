"use client";

import Link from "next/link";
import { Building2, Wallet, Bot, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { href: "/dashboard/invest", label: "Acquire Fractional Units", icon: Building2, description: "Capital allocation terminal" },
  { href: "/dashboard/wallet", label: "Liquidity Injection", icon: Wallet, description: "Deposit or clear yield balances" },
  { href: "/dashboard/ai-assistant", label: "Predictive Analytics", icon: Bot, description: "Consult risk evaluation modeling" },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-[#E2B93B]" />
        <h2 className="text-base font-bold text-white tracking-tight">Operations Module</h2>
      </div>
      <div className="space-y-2.5">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="block">
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-3.5 px-4 bg-[#13161C]/40 border-neutral-800/80 hover:border-[#E2B93B]/20 hover:bg-[#13161C] rounded-xl group text-left transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#E2B93B]/5 border border-[#E2B93B]/10 flex items-center justify-center shrink-0 group-hover:bg-[#E2B93B]/10 transition-all">
                  <action.icon className="w-4 h-4 text-[#E2B93B]" />
                </div>
                <div className="truncate space-y-0.5">
                  <div className="text-xs font-bold text-white group-hover:text-[#E2B93B] transition-colors">{action.label}</div>
                  <div className="text-[11px] text-neutral-400 truncate">{action.description}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}