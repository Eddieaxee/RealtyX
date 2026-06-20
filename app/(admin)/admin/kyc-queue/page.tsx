"use client";

import { useState, useEffect } from "react";
import { Shield, Search, CheckCircle, XCircle } from "lucide-react";

interface KYCRecord {
  id: string;
  userId: string;
  status: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
}

export default function AdminKYCQueuePage() {
  const [records, setRecords] = useState<KYCRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/admin/kyc");
      const data = await res.json();
      if (data.success) setRecords(data.records.filter((r: KYCRecord) => r.status === "PENDING"));
    } catch (err) {
      console.error("Failed to fetch KYC queue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/kyc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchQueue();
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  const filtered = records.filter((r) =>
    r.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    r.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    r.user.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#E2B93B] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
          <Shield className="w-3.5 h-3.5" /> Verification Queue
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          Pending Verifications
        </h1>
        <p className="text-neutral-500 mt-1 text-sm">{records.length} submissions awaiting review</p>
      </div>

      <div className="flex items-center gap-2 bg-[#13161C] border border-white/5 rounded-xl px-3 h-10 max-w-md">
        <Search className="w-4 h-4 text-neutral-500 shrink-0" />
        <input type="text" placeholder="Search queue..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none w-full font-mono" />
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#0D0E12] shadow-xl overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-white/5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            <div className="col-span-2">Applicant</div>
            <div>Submitted</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 text-sm">No pending verifications</div>
          ) : (
            filtered.map((record) => (
              <div key={record.id} className="grid grid-cols-5 gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] items-center">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-xs">
                    {record.firstName?.[0]}{record.lastName?.[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{record.firstName} {record.lastName}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">{record.user.email}</div>
                  </div>
                </div>
                <div className="text-xs text-neutral-400 font-mono">{new Date(record.createdAt).toLocaleDateString()}</div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded border text-amber-400 bg-amber-500/10 border-amber-500/20">
                    PENDING
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => updateStatus(record.id, "APPROVED")}
                    className="p-2 rounded-lg hover:bg-emerald-500/10" title="Approve">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </button>
                  <button onClick={() => updateStatus(record.id, "REJECTED")}
                    className="p-2 rounded-lg hover:bg-red-500/10" title="Reject">
                    <XCircle className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}