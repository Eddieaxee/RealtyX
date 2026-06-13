"use client";

import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { UserCheck, UserX, Clock, Users, ExternalLink } from "lucide-react";

const users = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "active", kyc: "verified", joined: "2024-05-22", investments: 12, avatar: "AJ" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", status: "active", kyc: "pending", joined: "2024-05-21", investments: 0, avatar: "BS" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", status: "suspended", kyc: "rejected", joined: "2024-05-20", investments: 3, avatar: "CB" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", status: "active", kyc: "verified", joined: "2024-05-19", investments: 8, avatar: "DP" },
  { id: "5", name: "Evan Wright", email: "evan@example.com", status: "pending", kyc: "submitted", joined: "2024-05-18", investments: 0, avatar: "EW" },
];

export function RecentUsers() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Users className="w-4 h-4 text-[#E2B93B]" /> Recent Registrations
        </h3>
        <a href="/admin/users" className="text-[10px] font-mono text-[#E2B93B] hover:text-[#B89221] transition-colors flex items-center gap-1">
          View All <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 hover:border-white/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E2B93B]/20 to-[#B89221]/20 border border-[#E2B93B]/10 flex items-center justify-center text-[10px] font-bold text-[#E2B93B]">
                {user.avatar}
              </div>
              <div>
                <div className="font-bold text-xs text-white">{user.name}</div>
                <div className="text-[10px] text-neutral-500 font-mono">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
                <span className="text-white font-bold">{user.investments}</span> investments
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase border ${
                user.status === "active"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : user.status === "suspended"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                {user.status === "active" ? (
                  <UserCheck className="w-3 h-3" />
                ) : user.status === "suspended" ? (
                  <UserX className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                {user.status}
              </span>
              <span className={`inline-flex px-2 py-1 rounded-lg text-[9px] font-bold uppercase border ${
                user.kyc === "verified"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : user.kyc === "rejected"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                {user.kyc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}