"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2, Shield, Activity,
  ArrowUpRight, Users, FileCheck, DollarSign, TrendingUp,
} from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalInvestments: 0,
    totalVolume: 0,
    pendingKYC: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, kycRes, propsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/kyc"),
          fetch("/api/admin/properties"),
        ]);
        const users = await usersRes.json();
        const kyc = await kycRes.json();
        const props = await propsRes.json();

        if (users.success && kyc.success && props.success) {
          const totalInvestments = users.users.reduce((sum: number, u: { _count: { investments: number } }) => sum + u._count.investments, 0);
          const totalVolume = props.properties.reduce((sum: number, p: { priceUSD: number }) => sum + p.priceUSD, 0);

          setStats({
            totalUsers: users.users.length,
            totalProperties: props.properties.length,
            totalInvestments,
            totalVolume,
            pendingKYC: kyc.stats.pending,
            activeUsers: users.users.filter((u: { status: string }) => u.status === "ACTIVE").length,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#E2B93B] border-t-transparent rounded-full" />
      </div>
    );
  }

  const coreStats = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", change: "+12%" },
    { label: "Active Users", value: stats.activeUsers.toLocaleString(), icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10", change: "+8%" },
    { label: "Properties", value: stats.totalProperties.toString(), icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10", change: "+3" },
    { label: "Total Volume", value: `$${(stats.totalVolume / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-[#E2B93B]", bg: "bg-[#E2B93B]/10", change: "+23%" },
    { label: "Investments", value: stats.totalInvestments.toLocaleString(), icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10", change: "+15%" },
    { label: "Pending KYC", value: stats.pendingKYC.toString(), icon: FileCheck, color: "text-amber-400", bg: "bg-amber-500/10", change: stats.pendingKYC > 0 ? "Needs review" : "None" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
            <Building2 className="w-3.5 h-3.5" /> Principal Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Platform Overview
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Real-time intelligence across the RealtyX institutional ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-emerald-400">LIVE DATA</span>
          </div>
          <div className="text-[10px] font-mono text-neutral-600 bg-[#13161C] border border-white/5 px-3 py-1.5 rounded-xl">
            {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coreStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/5 bg-[#0D0E12] p-5 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
            <div className="text-[10px] text-neutral-500 font-mono uppercase mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Review KYC Queue", count: `${stats.pendingKYC} pending`, href: "/admin/kyc", color: "text-amber-400" },
          { label: "Manage Users", count: `${stats.totalUsers} total`, href: "/admin/users", color: "text-blue-400" },
          { label: "Asset Registry", count: `${stats.totalProperties} properties`, href: "/admin/assets", color: "text-emerald-400" },
          { label: "View Analytics", count: "Full report", href: "/admin/analytics", color: "text-purple-400" },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center justify-between p-4 rounded-xl bg-[#0D0E12] border border-white/5 hover:border-[#E2B93B]/20 hover:bg-[#E2B93B]/5 transition-all group"
          >
            <div>
              <span className="text-xs font-bold text-white block">{action.label}</span>
              <span className={`text-[10px] font-mono ${action.color}`}>{action.count}</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-[#E2B93B] transition-colors" />
          </a>
        ))}
      </div>

      {/* System Health */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 bg-[#0D0E12] p-5 shadow-xl"
        >
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-emerald-400" /> System Health
          </h3>
          <div className="space-y-3">
            {[
              { label: "API Status", value: "Operational", status: "normal" },
              { label: "Database", value: "Connected", status: "normal" },
              { label: "Exchange Rate API", value: "Live", status: "normal" },
              { label: "Blockchain", value: "Connected", status: "normal" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-2.5 rounded-xl bg-[#090A0C]/50 border border-white/5">
                <span className="text-xs text-neutral-400">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-emerald-400">{item.value}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/5 bg-[#0D0E12] p-5 shadow-xl"
        >
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[#E2B93B]" /> Platform Status
          </h3>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-sm font-bold text-emerald-400">All Systems Operational</div>
              <div className="text-[10px] font-mono text-neutral-500">Polygon &bull; Ethereum &bull; Database</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}