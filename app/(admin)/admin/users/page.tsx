"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, Shield, Ban, CheckCircle,
  Building2, TrendingUp, Eye, X, Wallet, UserCheck,
  AlertTriangle,
} from "lucide-react";

interface UserRecord {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  image: string | null;
  createdAt: string;
  _count: { investments: number };
  kyc: { status: string } | null;
}

interface UserDetail {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  image: string | null;
  createdAt: string;
  _count: { investments: number };
  kyc: { status: string; firstName?: string; lastName?: string; idType?: string; country?: string } | null;
  investments?: Array<{
    id: string;
    amount: number;
    property: { title: string; priceUSD: number };
    createdAt: string;
  }>;
  wallet?: { balance: number; totalInvested: number; totalReturns: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED" | "ADMIN">("ALL");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const fetchUserDetail = async (userId: string) => {
    setUserDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/users?id=${userId}&detail=true`);
      const data = await res.json();
      if (data.success) setSelectedUser(data.user);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    } finally {
      setUserDetailLoading(false);
    }
  };

  const updateUser = async (id: string, updates: { role?: string; status?: string }) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.success) fetchUsers();
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  const filteredUsers = useMemo(() => {
    let list = users;
    if (filter !== "ALL") {
      if (filter === "ADMIN") {
        list = list.filter(u => u.role === "ADMIN");
      } else {
        list = list.filter(u => u.status === filter);
      }
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, search, filter]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === "ACTIVE").length,
    suspended: users.filter(u => u.status === "SUSPENDED").length,
    admins: users.filter(u => u.role === "ADMIN").length,
    pendingKYC: users.filter(u => u.kyc && u.kyc.status === "PENDING").length,
  }), [users]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#E2B93B] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
            <Users className="w-3.5 h-3.5" /> User Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Platform Users
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">{users.length} total users</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Users", value: stats.total, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Active", value: stats.active, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Suspended", value: stats.suspended, icon: Ban, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Admins", value: stats.admins, icon: Shield, color: "text-[#E2B93B]", bg: "bg-[#E2B93B]/10" },
          { label: "Pending KYC", value: stats.pendingKYC, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-[#0D0E12] p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-mono">{stat.value}</div>
                <div className="text-[10px] text-neutral-500 font-mono">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 flex items-center gap-2 bg-[#13161C] border border-white/5 rounded-xl px-3 h-10 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input type="text" placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none w-full font-mono" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["ALL", "ACTIVE", "SUSPENDED", "ADMIN"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-[#E2B93B]/10 text-[#E2B93B] border border-[#E2B93B]/20"
                  : "bg-[#13161C] text-neutral-500 border border-white/5 hover:text-white"
              }`}>
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/5 bg-[#0D0E12] shadow-xl overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-7 gap-4 p-4 border-b border-white/5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            <div className="col-span-2">User</div>
            <div>Role</div>
            <div>Status</div>
            <div>KYC</div>
            <div>Investments</div>
            <div>Joined</div>
            <div className="text-right">Actions</div>
          </div>
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id}
                className="grid grid-cols-7 gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center cursor-pointer"
                onClick={() => fetchUserDetail(user.id)}>
                <div className="col-span-2 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {user.name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{user.name || "Unnamed"}</div>
                    <div className="text-[10px] text-neutral-500 font-mono truncate">{user.email}</div>
                  </div>
                </div>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                    user.role === "ADMIN" ? "text-[#E2B93B] bg-[#E2B93B]/10 border-[#E2B93B]/20" : "text-blue-400 bg-blue-500/10 border-blue-500/20"
                  }`}>{user.role}</span>
                </div>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                    user.status === "ACTIVE" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                    user.status === "SUSPENDED" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                    "text-neutral-500 bg-neutral-500/10 border-neutral-500/20"
                  }`}>{user.status}</span>
                </div>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                    !user.kyc ? "text-neutral-500 bg-neutral-500/10 border-neutral-500/20" :
                    user.kyc.status === "APPROVED" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                    user.kyc.status === "REJECTED" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                    "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  }`}>{user.kyc?.status || "NONE"}</span>
                </div>
                <div className="text-xs text-neutral-400 font-mono">{user._count.investments}</div>
                <div className="text-[10px] text-neutral-500 font-mono">{new Date(user.createdAt).toLocaleDateString()}</div>
                <div className="flex items-center justify-end gap-1">
                  <button onClick={(e) => { e.stopPropagation(); fetchUserDetail(user.id); }}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors" title="View user details">
                    <Eye className="w-4 h-4 text-neutral-400" />
                  </button>
                  {user.role !== "ADMIN" && (
                  <button onClick={(e) => { e.stopPropagation(); updateUser(user.id, { role: "ADMIN" }); }}
                    className="p-2 rounded-lg hover:bg-[#E2B93B]/10 transition-colors" title="Promote to admin">
                    <Shield className="w-4 h-4 text-[#E2B93B]" />
                  </button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); updateUser(user.id, { status: user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }); }}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    title={user.status === "ACTIVE" ? "Suspend user" : "Activate user"}>
                    {user.status === "ACTIVE" ? <Ban className="w-4 h-4 text-red-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-3xl rounded-2xl border border-white/5 bg-[#0D0E12] shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedUser.name?.[0] || selectedUser.email[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedUser.name || "Unnamed"}</h2>
                  <p className="text-sm text-neutral-500 font-mono">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-neutral-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {userDetailLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin w-6 h-6 border-2 border-[#E2B93B] border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Account Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                    <div className="text-[9px] text-neutral-500 font-mono mb-1">Role</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      selectedUser.role === "ADMIN" ? "text-[#E2B93B] bg-[#E2B93B]/10 border-[#E2B93B]/20" : "text-blue-400 bg-blue-500/10 border-blue-500/20"
                    }`}>{selectedUser.role}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                    <div className="text-[9px] text-neutral-500 font-mono mb-1">Status</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      selectedUser.status === "ACTIVE" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-red-400 bg-red-500/10 border-red-500/20"
                    }`}>{selectedUser.status}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                    <div className="text-[9px] text-neutral-500 font-mono mb-1">KYC Status</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      !selectedUser.kyc ? "text-neutral-500 bg-neutral-500/10 border-neutral-500/20" :
                      selectedUser.kyc.status === "APPROVED" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                      selectedUser.kyc.status === "REJECTED" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                      "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    }`}>{selectedUser.kyc?.status || "NONE"}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                    <div className="text-[9px] text-neutral-500 font-mono mb-1">Joined</div>
                    <div className="text-xs font-bold text-white font-mono">{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Wallet / Financial Overview */}
                <div className="rounded-xl border border-white/5 bg-[#090A0C] p-4">
                  <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <Wallet className="w-3.5 h-3.5 text-[#E2B93B]" /> Financial Overview
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-[9px] text-neutral-500 mb-1">Wallet Balance</div>
                      <div className="text-sm font-bold text-white font-mono">
                        ${(selectedUser.wallet?.balance || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-[9px] text-neutral-500 mb-1">Total Invested</div>
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        ${(selectedUser.wallet?.totalInvested || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="text-[9px] text-neutral-500 mb-1">Total Returns</div>
                      <div className="text-sm font-bold text-[#E2B93B] font-mono">
                        ${(selectedUser.wallet?.totalReturns || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* KYC Details */}
                {selectedUser.kyc && (
                  <div className="rounded-xl border border-white/5 bg-[#090A0C] p-4">
                    <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#E2B93B]" /> KYC Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 rounded-lg bg-white/[0.02]">
                        <div className="text-[9px] text-neutral-500">First Name</div>
                        <div className="text-xs text-white font-mono">{selectedUser.kyc.firstName || "—"}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02]">
                        <div className="text-[9px] text-neutral-500">Last Name</div>
                        <div className="text-xs text-white font-mono">{selectedUser.kyc.lastName || "—"}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02]">
                        <div className="text-[9px] text-neutral-500">ID Type</div>
                        <div className="text-xs text-white font-mono">{selectedUser.kyc.idType || "—"}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02]">
                        <div className="text-[9px] text-neutral-500">Country</div>
                        <div className="text-xs text-white font-mono">{selectedUser.kyc.country || "—"}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Investments */}
                <div className="rounded-xl border border-white/5 bg-[#090A0C] p-4">
                  <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#E2B93B]" /> Investments ({selectedUser._count.investments})
                  </h3>
                  {selectedUser.investments && selectedUser.investments.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUser.investments.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-[#E2B93B]" />
                            <div>
                              <div className="text-xs text-white font-bold">{inv.property.title}</div>
                              <div className="text-[9px] text-neutral-500 font-mono">{new Date(inv.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="text-xs font-bold text-[#E2B93B] font-mono">${inv.amount.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500 text-center py-4">No investments yet</p>
                  )}
                </div>

                {/* Admin Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  {selectedUser.role !== "ADMIN" && (
                    <button onClick={() => { updateUser(selectedUser.id, { role: "ADMIN" }); setSelectedUser(null); }}
                      className="flex-1 py-3 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B] font-bold text-sm hover:bg-[#E2B93B]/20 transition-all">
                      <Shield className="w-4 h-4 inline mr-2" /> Promote to Admin
                    </button>
                  )}
                  <button onClick={() => { updateUser(selectedUser.id, { status: selectedUser.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }); setSelectedUser(null); }}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      selectedUser.status === "ACTIVE"
                        ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                        : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                    }`}>
                    {selectedUser.status === "ACTIVE" ? <><Ban className="w-4 h-4 inline mr-2" /> Suspend User</> : <><CheckCircle className="w-4 h-4 inline mr-2" /> Activate User</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}