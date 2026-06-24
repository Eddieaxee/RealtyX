"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  userId: string;
  type: string;
  amountUSD: number;
  amountNGN: number | null;
  currency: string;
  gateway: string | null;
  status: string;
  paymentMethod: string | null;
  txReference: string | null;
  providerRef: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

interface Stats {
  totalTransactions: number;
  totalVolumeUSD: number;
  pendingCount: number;
  successCount: number;
  failedCount: number;
  depositCount: number;
  investmentCount: number;
  withdrawalCount: number;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gatewayFilter, setGatewayFilter] = useState("all");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "50");
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (gatewayFilter !== "all") params.set("gateway", gatewayFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/transactions?${params}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions);
        setStats(data.stats);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, statusFilter, gatewayFilter, search]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Success
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
            Pending
          </Badge>
        );
      case "FAILED":
      case "CANCELLED":
        return (
          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-neutral-500/10 text-neutral-400 border-neutral-500/20">
            {status}
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            Deposit
          </Badge>
        );
      case "INVESTMENT":
        return (
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            Investment
          </Badge>
        );
      case "WITHDRAWAL":
        return (
          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20">
            Withdrawal
          </Badge>
        );
      case "DIVIDEND":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            Dividend
          </Badge>
        );
      default:
        return (
          <Badge className="bg-neutral-500/10 text-neutral-400 border-neutral-500/20">
            {type}
          </Badge>
        );
    }
  };

  const getGatewayBadge = (gateway: string | null) => {
    if (!gateway) return <span className="text-neutral-500">—</span>;
    const colors: Record<string, string> = {
      PAYSTACK: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      OPAY: "bg-green-500/10 text-green-400 border-green-500/20",
      SPENDEX: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      WEB3: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      PAYPAL: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    };
    return (
      <Badge
        className={colors[gateway] || "bg-neutral-500/10 text-neutral-400"}
      >
        {gateway}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
            <Filter className="w-3.5 h-3.5" /> Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Transaction Ledger
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            {stats?.totalTransactions || 0} total transactions · $
            {(stats?.totalVolumeUSD || 0).toLocaleString()} volume
          </p>
        </div>
        <Button
          onClick={fetchTransactions}
          variant="ghost"
          className="gap-2 text-neutral-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total Volume",
              value: `$${(stats.totalVolumeUSD / 1000).toFixed(1)}K`,
              color: "text-[#E2B93B]",
            },
            {
              label: "Success",
              value: stats.successCount,
              color: "text-emerald-400",
            },
            {
              label: "Pending",
              value: stats.pendingCount,
              color: "text-amber-400",
            },
            {
              label: "Failed",
              value: stats.failedCount,
              color: "text-red-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-3 rounded-xl bg-[#0D0E12] border border-white/5"
            >
              <div className="text-[10px] text-neutral-500 font-mono uppercase">
                {stat.label}
              </div>
              <div className={`text-lg font-bold font-mono ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-[#13161C] border border-white/5 rounded-xl px-3 h-10 w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by user, email, reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchTransactions()}
            className="bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none w-full font-mono"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            aria-label="Filter by transaction type"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-[#13161C] border border-white/5 text-xs text-white font-mono outline-none"
          >
            <option value="all">All Types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="INVESTMENT">Investment</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="DIVIDEND">Dividend</option>
          </select>
          <select
            aria-label="Filter by transaction status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-[#13161C] border border-white/5 text-xs text-white font-mono outline-none"
          >
            <option value="all">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <select
            aria-label="Filter by transaction gateway"
            value={gatewayFilter}
            onChange={(e) => {
              setGatewayFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-[#13161C] border border-white/5 text-xs text-white font-mono outline-none"
          >
            <option value="all">All Gateways</option>
            <option value="PAYSTACK">Paystack</option>
            <option value="OPAY">OPay</option>
            <option value="SPENDEX">Spendex</option>
            <option value="WEB3">Web3</option>
            <option value="PAYPAL">PayPal</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-[#E2B93B] border-t-transparent rounded-full" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-12 text-center">
          <Filter className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">No Transactions Found</h3>
          <p className="text-neutral-500 text-sm">
            No transactions match your current filters.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#0D0E12] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-[#090A0C]">
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">
                    User
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">
                    Gateway
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">
                    Reference
                  </th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-white font-medium">
                          {tx.user.name || "—"}
                        </div>
                        <div className="text-neutral-500 text-xs">
                          {tx.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getTypeBadge(tx.type)}</td>
                    <td className="px-4 py-3">
                      <div className="text-white font-mono font-bold">
                        ${tx.amountUSD.toLocaleString()}
                      </div>
                      {tx.amountNGN && tx.amountNGN > 0 && (
                        <div className="text-neutral-500 text-xs font-mono">
                          ₦{tx.amountNGN.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{getGatewayBadge(tx.gateway)}</td>
                    <td className="px-4 py-3">{getStatusBadge(tx.status)}</td>
                    <td className="px-4 py-3">
                      <div className="text-neutral-400 font-mono text-xs max-w-[120px] truncate">
                        {tx.txReference || tx.providerRef || tx.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 font-mono text-xs">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
              <div className="text-xs text-neutral-500 font-mono">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
