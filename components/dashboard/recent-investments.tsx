"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const investments = [
  { id: "1", property: "Eko Atlantic High-Rise Alpha", location: "Victoria Island, Lagos", tokens: 250, amount: 12500000, date: "2026-05-12", status: "Active", return: 16.4 },
  { id: "2", property: "Ikoyi Luxury Residential Complex", location: "Ikoyi, Lagos", tokens: 160, amount: 8000000, date: "2026-04-18", status: "Active", return: 14.8 },
  { id: "3", property: "Maitama Commercial Workspace", location: "Maitama, Abuja", tokens: 80, amount: 4000000, date: "2026-03-02", status: "Active", return: 13.2 },
];

export function RecentInvestments() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Active Holdings Ledger</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Live monitoring of premium fractionized placement assets.</p>
        </div>
<Link href="/portfolio">
          <Button variant="ghost" size="sm" className="group text-xs text-[#E2B93B] hover:text-[#B89221] hover:bg-white/5 rounded-xl transition-all">
            Inspect Ledger
            <ArrowRight className="ml-1.5 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {investments.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between p-4 rounded-xl bg-[#13161C]/40 border border-white/5 hover:border-white/10 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#E2B93B]/5 border border-[#E2B93B]/10 flex items-center justify-center shrink-0 group-hover:bg-[#E2B93B]/10 transition-colors">
                <Building2 className="w-5 h-5 text-[#E2B93B]" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h3 className="text-sm font-bold text-white truncate group-hover:text-[#E2B93B] transition-colors">{inv.property}</h3>
                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  <MapPin className="w-3 h-3 text-neutral-500" />
                  <span className="truncate">{inv.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 text-right shrink-0">
              <div className="hidden sm:block space-y-0.5">
                <div className="text-sm font-bold font-mono text-white">₦{inv.amount.toLocaleString()}</div>
                <div className="text-[11px] font-mono text-neutral-500 flex items-center justify-end gap-1">
                  <Layers className="w-2.5 h-2.5" /> {inv.tokens} units
                </div>
              </div>
              
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-emerald-400 font-mono">+{inv.return}% ARR</div>
                <div className="text-[11px] font-mono text-neutral-500">
                  {new Date(inv.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}