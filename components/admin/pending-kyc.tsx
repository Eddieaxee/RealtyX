"use client";

import { motion } from "framer-motion";
import { Clock, X, Check, Shield, AlertTriangle } from "lucide-react";

const kycItems = [
  {
    id: "1",
    name: "Sarah Connor",
    submitted: "2024-05-22",
    type: "Individual",
    risk: "low",
    documents: ["ID", "Proof of Address"],
    avatar: "SC",
  },
  {
    id: "2",
    name: "James Bond",
    submitted: "2024-05-21",
    type: "Individual",
    risk: "medium",
    documents: ["ID", "Selfie", "BVN"],
    avatar: "JB",
  },
  {
    id: "3",
    name: "Wayne Enterprises",
    submitted: "2024-05-20",
    type: "Corporate",
    risk: "high",
    documents: ["CAC", "Directors ID", "Utility Bill"],
    avatar: "WE",
  },
  {
    id: "4",
    name: "Tony Stark",
    submitted: "2024-05-19",
    type: "Individual",
    risk: "low",
    documents: ["ID", "NIN"],
    avatar: "TS",
  },
];

export function PendingKYC() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" /> KYC Review Queue
        </h3>
        <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {kycItems.length} pending
        </span>
      </div>
      <div className="space-y-3">
        {kycItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-[#090A0C]/50 border border-white/5 space-y-3 hover:border-white/10 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E2B93B]/20 to-[#B89221]/20 border border-[#E2B93B]/10 flex items-center justify-center text-[10px] font-bold text-[#E2B93B]">
                  {item.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{item.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono mt-0.5">
                    <Clock className="w-3 h-3" />
                    {item.submitted} &middot; {item.type}
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase border ${
                  item.risk === "low"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : item.risk === "medium"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {item.risk === "high" && <AlertTriangle className="w-3 h-3 inline mr-0.5" />}
                {item.risk} risk
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {item.documents.map((doc) => (
                <span key={doc} className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-white/5 text-neutral-400 border border-white/5">
                  {doc}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 h-8 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/10 text-neutral-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all flex items-center justify-center gap-1">
                <X className="w-3 h-3" />
                Reject
              </button>
              <button className="flex-1 h-8 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-black hover:opacity-90 transition-all flex items-center justify-center gap-1 shadow-md shadow-[#E2B93B]/10">
                <Check className="w-3 h-3" />
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
      <a
        href="/admin/kyc"
        className="mt-4 block text-center text-[10px] font-mono text-[#E2B93B] hover:text-[#B89221] transition-colors py-2 rounded-xl border border-white/5 hover:border-[#E2B93B]/20"
      >
        View Full Queue &rarr;
      </a>
    </motion.div>
  );
}