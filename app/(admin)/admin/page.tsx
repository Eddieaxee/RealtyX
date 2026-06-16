"use client";

import { motion } from "framer-motion";
import { AdminStats } from "@/components/admin/admin-stats";
import { RecentUsers } from "@/components/admin/recent-users";
import { PendingKYC } from "@/components/admin/pending-kyc";
import { PlatformActivity } from "@/components/admin/platform-activity";
import {
  Building2,
  Shield,
  Wallet,
  BarChart3,
  Globe,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

/** System health indicators */
const systemHealth = [
  { label: "API Latency", value: "12ms", status: "normal", icon: Activity },
  { label: "Uptime", value: "99.97%", status: "normal", icon: Globe },
  { label: "DB Connections", value: "24/50", status: "normal", icon: RefreshCw },
  { label: "Error Rate", value: "0.02%", status: "normal", icon: Shield },
];

/** Recent high-value transactions */
const recentTransactions = [
  { id: "TXN-001", investor: "Chidi Okonkwo", property: "Lekki Premium Tower", amount: "$50,000", type: "Investment", status: "confirmed", time: "2m ago" },
  { id: "TXN-002", investor: "Fatima Al-Hassan", property: "Ikoyi Residence Park", amount: "$25,000", type: "Investment", status: "confirmed", time: "8m ago" },
  { id: "TXN-003", investor: "Emeka Nwosu", property: "Victoria Island Complex", amount: "$12,500", type: "Withdrawal", status: "pending", time: "15m ago" },
  { id: "TXN-004", investor: "Aisha Bello", property: "Maitama Executive Suite", amount: "$100,000", type: "Investment", status: "confirmed", time: "22m ago" },
  { id: "TXN-005", investor: "Tunde Adeyemi", property: "Banana Island Villa", amount: "$75,000", type: "Investment", status: "processing", time: "31m ago" },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
            <Building2 className="w-3.5 h-3.5" /> Principal Command Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Platform Overview
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Real-time intelligence across the RealtyX institutional ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              LIVE DATA
            </span>
          </div>
          <div className="text-[10px] font-mono text-neutral-600 bg-[#13161C] border border-white/5 px-3 py-1.5 rounded-xl">
            Last sync: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Core Stats */}
      <AdminStats />

      {/* System Health + Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlatformActivity />
        </div>
        <div className="space-y-4">
          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/5 bg-[#0D0E12] p-5 space-y-4 shadow-xl"
          >
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> System Health
            </h3>
            <div className="space-y-3">
              {systemHealth.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-2.5 rounded-xl bg-[#090A0C]/50 border border-white/5">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="text-xs text-neutral-400">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-white">{item.value}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/5 bg-[#0D0E12] p-5 space-y-3 shadow-xl"
          >
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#E2B93B]" /> Quick Actions
            </h3>
            {[
              { label: "Review KYC Queue", count: "234 pending", href: "/admin/kyc", color: "text-amber-400" },
              { label: "Manage Users", count: "52,430 total", href: "/admin/users", color: "text-blue-400" },
              { label: "Asset Registry", count: "156 properties", href: "/admin/assets", color: "text-emerald-400" },
              { label: "View Analytics", count: "Full report", href: "/admin/analytics", color: "text-purple-400" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-between p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 hover:border-[#E2B93B]/20 hover:bg-[#E2B93B]/5 transition-all group"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{action.label}</span>
                  <span className={`text-[10px] font-mono ${action.color}`}>{action.count}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-[#E2B93B] transition-colors" />
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Users + KYC */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#E2B93B]" /> High-Value Transactions
              </h3>
              <a href="/admin/analytics" className="text-[10px] font-mono text-[#E2B93B] hover:text-[#B89221] transition-colors">
                View All &rarr;
              </a>
            </div>
            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tx.type === "Investment" ? "bg-emerald-500/10" : "bg-amber-500/10"
                    }`}>
                      {tx.type === "Investment" ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-white font-bold block">{tx.investor}</span>
                      <span className="text-[10px] text-neutral-500">{tx.property}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold block ${
                      tx.type === "Investment" ? "text-emerald-400" : "text-amber-400"
                    }`}>
                      {tx.type === "Investment" ? "+" : "-"}{tx.amount}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${
                      tx.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      tx.status === "pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <RecentUsers />
        </div>
        <PendingKYC />
      </div>
    </div>
  );
}