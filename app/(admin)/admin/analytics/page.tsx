"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, DollarSign, Building2, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    totalVolume: 0,
    totalProperties: 0,
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

          setData({
            totalUsers: users.users.length,
            totalInvestments,
            totalVolume,
            totalProperties: props.properties.length,
            pendingKYC: kyc.stats.pending,
            activeUsers: users.users.filter((u: { status: string }) => u.status === "ACTIVE").length,
          });
        }
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
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

  const stats = [
    { label: "Total Users", value: data.totalUsers.toLocaleString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", change: "+12%", positive: true },
    { label: "Active Users", value: data.activeUsers.toLocaleString(), icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10", change: "+8%", positive: true },
    { label: "Total Volume", value: `$${(data.totalVolume / 1000000).toFixed(1)}M`, icon: DollarSign, color: "text-[#E2B93B]", bg: "bg-[#E2B93B]/10", change: "+23%", positive: true },
    { label: "Properties", value: data.totalProperties.toString(), icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10", change: "+3", positive: true },
    { label: "Investments", value: data.totalInvestments.toLocaleString(), icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10", change: "+15%", positive: true },
    { label: "Pending KYC", value: data.pendingKYC.toString(), icon: Users, color: "text-amber-400", bg: "bg-amber-500/10", change: "-5%", positive: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
          <BarChart3 className="w-3.5 h-3.5" /> Analytics
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          Platform Analytics
        </h1>
        <p className="text-neutral-500 mt-1 text-sm">Real-time platform metrics and insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
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
              <div className={`flex items-center gap-1 text-xs font-mono font-bold ${stat.positive ? "text-emerald-400" : "text-red-400"}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
            <div className="text-[10px] text-neutral-500 font-mono uppercase mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4">Revenue Overview</h3>
          <div className="h-48 flex items-center justify-center border border-dashed border-white/5 rounded-xl">
            <p className="text-neutral-500 text-xs font-mono">Chart visualization coming soon</p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4">User Growth</h3>
          <div className="h-48 flex items-center justify-center border border-dashed border-white/5 rounded-xl">
            <p className="text-neutral-500 text-xs font-mono">Chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}