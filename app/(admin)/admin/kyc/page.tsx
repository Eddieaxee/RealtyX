"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileCheck, Search, CheckCircle, XCircle, Clock, Eye, Shield,
  User, Mail, Phone, MapPin, Globe, Calendar, CreditCard, FileText,
  X,
} from "lucide-react";

interface KYCUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface KYCRecord {
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
  user: KYCUser;
}

export default function AdminKYCPage() {
  const [records, setRecords] = useState<KYCRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedRecord, setSelectedRecord] = useState<KYCRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionInput, setShowRejectionInput] = useState(false);

  const fetchKYC = async () => {
    try {
      const res = await fetch("/api/admin/kyc");
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch KYC records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKYC(); }, []);

  const updateStatus = async (id: string, status: string, notes?: string) => {
    try {
      const res = await fetch("/api/admin/kyc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, notes }),
      });
      const data = await res.json();
      if (data.success) {
        fetchKYC();
        setSelectedRecord(null);
        setShowRejectionInput(false);
        setRejectionReason("");
      }
    } catch (err) {
      console.error("Failed to update KYC:", err);
    }
  };

  const filteredRecords = useMemo(() => {
    let list = records;
    if (filter !== "ALL") list = list.filter(r => r.status === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.firstName?.toLowerCase().includes(q) ||
        r.lastName?.toLowerCase().includes(q) ||
        r.user.email?.toLowerCase().includes(q) ||
        r.idNumber?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [records, search, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "REJECTED": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "PENDING": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default: return "text-neutral-400 bg-neutral-500/10 border-neutral-500/20";
    }
  };

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
            <Shield className="w-3.5 h-3.5" /> KYC Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Identity Verification Center
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">Review and verify user identity submissions with document checks</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Submissions", value: stats.total, icon: FileCheck, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/5 bg-[#0D0E12] p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">{stat.value}</div>
                <div className="text-[10px] text-neutral-500 font-mono uppercase">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-[#13161C] border border-white/5 rounded-xl px-3 h-10">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input type="text" placeholder="Search by name, email, or ID number..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none w-full font-mono" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
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

      {/* KYC Records Table */}
      <div className="rounded-2xl border border-white/5 bg-[#0D0E12] shadow-xl overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-7 gap-4 p-4 border-b border-white/5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            <div className="col-span-2">User</div>
            <div>ID Type</div>
            <div>ID Number</div>
            <div>Country</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          {filteredRecords.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">No KYC records found</div>
          ) : (
            filteredRecords.map((record) => (
              <div key={record.id}
                className="grid grid-cols-7 gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center cursor-pointer"
                onClick={() => { setSelectedRecord(record); setShowRejectionInput(false); }}>
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center text-black font-bold text-xs">
                    {record.firstName?.[0]}{record.lastName?.[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{record.firstName} {record.lastName}</div>
                    <div className="text-[10px] text-neutral-500 font-mono truncate">{record.user.email}</div>
                  </div>
                </div>
                <div className="text-xs text-neutral-400 font-mono">{record.idType || "—"}</div>
                <div className="text-xs text-neutral-400 font-mono truncate">{record.idNumber || "—"}</div>
                <div className="text-xs text-neutral-400 font-mono">{record.country || "—"}</div>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedRecord(record); setShowRejectionInput(false); }}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors" title="View Details">
                    <Eye className="w-4 h-4 text-neutral-400" />
                  </button>
                  {record.status === "PENDING" && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); updateStatus(record.id, "APPROVED"); }}
                        className="p-2 rounded-lg hover:bg-emerald-500/10 transition-colors" title="Approve">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedRecord(record); setShowRejectionInput(true); }}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors" title="Reject">
                        <XCircle className="w-4 h-4 text-red-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedRecord(null)}>
          <div className="w-full max-w-3xl rounded-2xl border border-white/5 bg-[#0D0E12] shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center text-black font-bold text-lg">
                  {selectedRecord.firstName?.[0]}{selectedRecord.lastName?.[0]}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedRecord.firstName} {selectedRecord.lastName}</h2>
                  <p className="text-sm text-neutral-500 font-mono">{selectedRecord.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${getStatusColor(selectedRecord.status)}`}>
                  {selectedRecord.status}
                </span>
                <button onClick={() => setSelectedRecord(null)} className="text-neutral-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Personal Information */}
              <div>
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#E2B93B]" /> Personal Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "First Name", value: selectedRecord.firstName, icon: User },
                    { label: "Last Name", value: selectedRecord.lastName, icon: User },
                    { label: "Email", value: selectedRecord.user.email, icon: Mail },
                    { label: "Phone", value: selectedRecord.phoneNumber, icon: Phone },
                    { label: "Date of Birth", value: selectedRecord.dateOfBirth ? new Date(selectedRecord.dateOfBirth).toLocaleDateString() : "—", icon: Calendar },
                    { label: "Address", value: selectedRecord.address, icon: MapPin },
                    { label: "Country", value: selectedRecord.country, icon: Globe },
                  ].map((field) => (
                    <div key={field.label} className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">{field.label}</div>
                      <div className="text-sm text-white font-mono">{field.value || "—"}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identity Documents */}
              <div>
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#E2B93B]" /> Identity Documents
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">ID Type</div>
                    <div className="text-sm text-white font-mono">{selectedRecord.idType || "—"}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">ID Number</div>
                    <div className="text-sm text-white font-mono">{selectedRecord.idNumber || "—"}</div>
                  </div>
                  {selectedRecord.idDocumentUrl && (
                    <div className="sm:col-span-2 p-3 rounded-xl bg-[#090A0C] border border-white/5">
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2">ID Document</div>
                      <a href={selectedRecord.idDocumentUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-all">
                        <FileText className="w-4 h-4" /> View Uploaded Document
                      </a>
                    </div>
                  )}
                  {selectedRecord.selfieUrl && (
                    <div className="sm:col-span-2 p-3 rounded-xl bg-[#090A0C] border border-white/5">
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2">Selfie / Portrait</div>
                      <a href={selectedRecord.selfieUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold hover:bg-purple-500/20 transition-all">
                        <FileText className="w-4 h-4" /> View Selfie
                      </a>
                    </div>
                  )}
                  {selectedRecord.proofOfAddress && (
                    <div className="sm:col-span-2 p-3 rounded-xl bg-[#090A0C] border border-white/5">
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-2">Proof of Address</div>
                      <a href={selectedRecord.proofOfAddress} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all">
                        <FileText className="w-4 h-4" /> View Proof of Address
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">Submitted</div>
                  <div className="text-sm text-white font-mono">{new Date(selectedRecord.createdAt).toLocaleString()}</div>
                </div>
                {selectedRecord.reviewedAt && (
                  <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                    <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">Reviewed</div>
                    <div className="text-sm text-white font-mono">{new Date(selectedRecord.reviewedAt).toLocaleString()}</div>
                  </div>
                )}
              </div>

              {/* Notes / Admin Comments */}
              {selectedRecord.notes && (
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-1">Admin Notes</div>
                  <div className="text-sm text-neutral-300">{selectedRecord.notes}</div>
                </div>
              )}

              {/* Rejection Input */}
              {showRejectionInput && selectedRecord.status === "PENDING" && (
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                  <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-red-400 mb-2">Rejection Reason</div>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejection..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090A0C] border border-white/5 text-sm text-white outline-none focus:border-red-500/50 font-mono mb-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(selectedRecord.id, "REJECTED", rejectionReason)}
                      className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all">
                      <XCircle className="w-4 h-4 inline mr-2" /> Confirm Rejection
                    </button>
                    <button onClick={() => setShowRejectionInput(false)}
                      className="py-2.5 px-4 rounded-xl bg-white/5 text-neutral-400 text-sm hover:bg-white/10 transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedRecord.status === "PENDING" && !showRejectionInput && (
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button onClick={() => updateStatus(selectedRecord.id, "APPROVED")}
                    className="flex-1 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20 transition-all">
                    <CheckCircle className="w-4 h-4 inline mr-2" /> Approve Identity
                  </button>
                  <button onClick={() => setShowRejectionInput(true)}
                    className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all">
                    <XCircle className="w-4 h-4 inline mr-2" /> Reject with Reason
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}