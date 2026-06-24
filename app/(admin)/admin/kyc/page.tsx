"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  User,
  FileText,
  RefreshCw,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KycRecord {
  id: string;
  userId: string;
  status: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  address: string | null;
  country: string | null;
  idType: string | null;
  idNumber: string | null;
  idDocumentUrl: string | null;
  selfieUrl: string | null;
  proofOfAddress: string | null;
  notes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    kycStatus: string;
    createdAt: string;
    walletAddress: string | null;
  };
}

export default function AdminKycPage() {
  const [kycs, setKycs] = useState<KycRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedKyc, setSelectedKyc] = useState<KycRecord | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  const fetchKycs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/kyc?${params}`);
      const data = await res.json();
      if (data.success) setKycs(data.kycs);
    } catch (err) {
      console.error("Failed to fetch KYC records:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { fetchKycs(); }, [fetchKycs]);

  const handleKycAction = async (kycId: string, action: "APPROVED" | "REJECTED") => {
    setProcessingId(kycId);
    try {
      const res = await fetch("/api/admin/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kycId, action, notes: actionNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setKycs((prev) =>
          prev.map((k) =>
            k.id === kycId
              ? { ...k, status: action, notes: actionNotes || k.notes, reviewedAt: new Date().toISOString() }
              : k
          )
        );
        setSelectedKyc(null);
        setActionNotes("");
      } else {
        alert(data.error || "Failed to update KYC");
      }
    } catch (err) {
      console.error("KYC action failed:", err);
      alert("Failed to update KYC status");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Pending</Badge>;
      case "APPROVED":
      case "VERIFIED":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Rejected</Badge>;
      default:
        return <Badge className="bg-neutral-500/10 text-neutral-400 border-neutral-500/20">{status}</Badge>;
    }
  };

  const getRiskBadge = (status: string) => {
    if (status === "PENDING") return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Medium</Badge>;
    if (status === "APPROVED" || status === "VERIFIED") return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Low</Badge>;
    return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">High</Badge>;
  };

  const pendingCount = kycs.filter((k) => k.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
            <Shield className="w-3.5 h-3.5" /> Compliance Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            KYC Management
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            {pendingCount} pending review · {kycs.length} total records
          </p>
        </div>
        <Button
          onClick={fetchKycs}
          variant="ghost"
          className="gap-2 text-neutral-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-[#13161C] border border-white/5 rounded-xl px-3 h-10 w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, ID number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none w-full font-mono"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                statusFilter === s
                  ? "bg-[#E2B93B]/10 text-[#E2B93B] border border-[#E2B93B]/20"
                  : "bg-[#13161C] text-neutral-500 border border-white/5 hover:text-white"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* KYC Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-[#E2B93B] border-t-transparent rounded-full" />
        </div>
      ) : kycs.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0D0E12] p-12 text-center">
          <Shield className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
          <h3 className="text-white font-bold mb-1">No KYC Records Found</h3>
          <p className="text-neutral-500 text-sm">No submissions match your current filters.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#0D0E12] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-[#090A0C]">
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">User</th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">ID Type</th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">Risk</th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">Submitted</th>
                  <th className="text-right px-4 py-3 text-[10px] font-mono font-bold uppercase text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kycs.map((kyc) => (
                  <tr key={kyc.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E2B93B]/10 flex items-center justify-center text-[#E2B93B] font-bold text-xs">
                          {(kyc.firstName?.[0] || kyc.user.name?.[0] || "?").toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {kyc.firstName} {kyc.lastName}
                          </div>
                          <div className="text-neutral-500 text-xs">{kyc.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 font-mono text-xs">
                      {kyc.idType || "—"}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(kyc.status)}</td>
                    <td className="px-4 py-3">{getRiskBadge(kyc.status)}</td>
                    <td className="px-4 py-3 text-neutral-400 font-mono text-xs">
                      {new Date(kyc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedKyc(kyc)}
                          className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {kyc.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedKyc(kyc);
                                setActionNotes("");
                              }}
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                              title="Approve KYC"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedKyc(kyc);
                                setActionNotes("");
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                              title="Reject KYC"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KYC Detail Modal */}
      {selectedKyc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => { setSelectedKyc(null); setActionNotes(""); }}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-white/5 bg-[#0D0E12] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#E2B93B]" />
                <span className="text-sm font-bold text-white">
                  {selectedKyc.firstName} {selectedKyc.lastName}
                </span>
                {getStatusBadge(selectedKyc.status)}
              </div>
              <button
                type="button"
                onClick={() => { setSelectedKyc(null); setActionNotes(""); }}
                className="text-neutral-500 hover:text-white"
                aria-label="Close KYC details"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Personal Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Full Name</div>
                  <div className="text-sm font-bold text-white">
                    {selectedKyc.firstName} {selectedKyc.lastName}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Email</div>
                  <div className="text-sm font-bold text-white">{selectedKyc.user.email}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">ID Type</div>
                  <div className="text-sm font-bold text-white">{selectedKyc.idType || "—"}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">ID Number</div>
                  <div className="text-sm font-bold text-white font-mono">{selectedKyc.idNumber || "—"}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Phone</div>
                  <div className="text-sm font-bold text-white">{selectedKyc.phoneNumber || "—"}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Address</div>
                  <div className="text-sm font-bold text-white">{selectedKyc.address || "—"}</div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#E2B93B]" /> Uploaded Documents
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  {selectedKyc.idDocumentUrl && (
                    <a
                      href={selectedKyc.idDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#090A0C] border border-white/5 hover:border-[#E2B93B]/20 transition-colors"
                    >
                      <div className="text-[10px] text-neutral-500 font-mono mb-1">ID Document</div>
                      <div className="text-xs text-[#E2B93B] flex items-center gap-1">
                        <Download className="w-3 h-3" /> View
                      </div>
                    </a>
                  )}
                  {selectedKyc.selfieUrl && (
                    <a
                      href={selectedKyc.selfieUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#090A0C] border border-white/5 hover:border-[#E2B93B]/20 transition-colors"
                    >
                      <div className="text-[10px] text-neutral-500 font-mono mb-1">Selfie</div>
                      <div className="text-xs text-[#E2B93B] flex items-center gap-1">
                        <Download className="w-3 h-3" /> View
                      </div>
                    </a>
                  )}
                  {selectedKyc.proofOfAddress && (
                    <a
                      href={selectedKyc.proofOfAddress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-[#090A0C] border border-white/5 hover:border-[#E2B93B]/20 transition-colors"
                    >
                      <div className="text-[10px] text-neutral-500 font-mono mb-1">Proof of Address</div>
                      <div className="text-xs text-[#E2B93B] flex items-center gap-1">
                        <Download className="w-3 h-3" /> View
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Notes Input */}
              {selectedKyc.status === "PENDING" && (
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase text-neutral-500 block mb-1">
                    Admin Notes (optional)
                  </label>
                  <textarea
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    placeholder="Add notes for approval/rejection..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-[#E2B93B]/50 font-mono"
                  />
                </div>
              )}

              {/* Existing Notes */}
              {selectedKyc.notes && selectedKyc.status !== "PENDING" && (
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 font-mono mb-1">Admin Notes</div>
                  <div className="text-sm text-neutral-300">{selectedKyc.notes}</div>
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedKyc.status === "PENDING" && (
              <div className="flex gap-3 p-5 border-t border-white/5">
                <Button
                  onClick={() => handleKycAction(selectedKyc.id, "REJECTED")}
                  disabled={processingId === selectedKyc.id}
                  variant="ghost"
                  className="flex-1 text-red-400 hover:bg-red-500/10 border border-red-500/20"
                >
                  {processingId === selectedKyc.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Reject"
                  )}
                </Button>
                <Button
                  onClick={() => handleKycAction(selectedKyc.id, "APPROVED")}
                  disabled={processingId === selectedKyc.id}
                  className="flex-1 bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#B89221] hover:to-[#917116] text-black font-bold"
                >
                  {processingId === selectedKyc.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    "Approve KYC"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}