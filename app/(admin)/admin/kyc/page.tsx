"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  User,
  Loader2,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface KYCProfile {
  id: string;
  firstName: string;
  lastName: string;
  status:
    | "PENDING"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "EXPIRED";
  idType: string;
  idNumber: string | null;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  submittedAt: string | null;
  reviewedAt: string | null;
  notes: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  user: { id: string; name: string | null; email: string } | null;
}

type FilterStatus =
  | "ALL"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export default function AdminKYCDashboard() {
  const [kycRequests, setKycRequests] = useState<KYCProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] =
    useState<FilterStatus>("SUBMITTED");
  const [selectedRecord, setSelectedRecord] = useState<KYCProfile | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/kyc", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch KYC queue");
        const data = await res.json();
        const records = data?.records || (Array.isArray(data) ? data : []);
        setKycRequests(records);
      } catch {
        setKycRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (
    id: string,
    action: "APPROVE" | "REJECT" | "FLAG",
  ) => {
    try {
      const res = await fetch("/api/admin/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kycId: id,
          action,
          notes: actionNotes || undefined,
        }),
      });

      if (!res.ok) return;

      setKycRequests((prev) => prev.filter((r) => r.id !== id));
      setSelectedRecord(null);
      setActionNotes("");
    } catch {
      // Silently handle
    }
  };

  const filteredRequests =
    selectedStatus === "ALL"
      ? kycRequests
      : kycRequests.filter((r) => r.status === selectedStatus);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Compliance Registry Control
          </h1>
          <p className="text-neutral-400 text-sm">
            Administrative oversight for identity verification payloads.
          </p>
        </div>
        <div className="flex gap-2">
          {(
            [
              "SUBMITTED",
              "UNDER_REVIEW",
              "APPROVED",
              "REJECTED",
              "ALL",
            ] as FilterStatus[]
          ).map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              onClick={() => setSelectedStatus(status)}
              className={
                selectedStatus === status ? "bg-[#E2B93B] text-black" : ""
              }
            >
              {status.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin w-10 h-10 text-[#E2B93B]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Records List */}
          <div
            className={`${selectedRecord ? "lg:col-span-1" : "lg:col-span-3"} bg-[#0D0E12] border border-white/5 rounded-xl overflow-hidden`}
          >
            <table className="w-full text-left text-sm">
              <thead className="bg-[#13161C] text-neutral-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Registry</th>
                  <th className="p-4">Risk</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-neutral-500 text-xs"
                    >
                      No KYC records found for this filter.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedRecord?.id === req.id ? "bg-white/5" : ""}`}
                      onClick={() => setSelectedRecord(req)}
                    >
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white text-xs">
                            {req.firstName} {req.lastName}
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            {req.user?.email || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs">
                        {req.idType}:{" "}
                        {req.idNumber
                          ? `${"*".repeat(Math.max(req.idNumber.length - 4, 0))}${req.idNumber.slice(-4)}`
                          : "N/A"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            req.riskLevel === "HIGH"
                              ? "bg-red-500/10 text-red-400"
                              : req.riskLevel === "MEDIUM"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {req.riskLevel}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            req.status === "APPROVED"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : req.status === "REJECTED"
                                ? "bg-red-500/10 text-red-400"
                                : req.status === "UNDER_REVIEW"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {req.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-neutral-400">
                        {req.submittedAt
                          ? new Date(req.submittedAt).toLocaleDateString(
                              "en-NG",
                            )
                          : "N/A"}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(req);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Detail Panel */}
          {selectedRecord && (
            <div className="lg:col-span-2 bg-[#0D0E12] border border-white/5 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  KYC Detail Review
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono uppercase">
                    Name
                  </span>
                  <p className="text-white font-medium">
                    {selectedRecord.firstName} {selectedRecord.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono uppercase">
                    Email
                  </span>
                  <p className="text-white font-medium">
                    {selectedRecord.user?.email || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono uppercase">
                    ID Type
                  </span>
                  <p className="text-white font-medium">
                    {selectedRecord.idType}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono uppercase">
                    ID Number
                  </span>
                  <p className="text-white font-mono">
                    {selectedRecord.idNumber
                      ? `${"*".repeat(Math.max(selectedRecord.idNumber.length - 4, 0))}${selectedRecord.idNumber.slice(-4)}`
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono uppercase">
                    Risk Level
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      selectedRecord.riskLevel === "HIGH"
                        ? "bg-red-500/10 text-red-400"
                        : selectedRecord.riskLevel === "MEDIUM"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {selectedRecord.riskLevel}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono uppercase">
                    Status
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      selectedRecord.status === "APPROVED"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : selectedRecord.status === "REJECTED"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {selectedRecord.status.replace("_", " ")}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono uppercase">
                    Address
                  </span>
                  <p className="text-white font-medium">
                    {selectedRecord.address || "N/A"},{" "}
                    {selectedRecord.city || ""} {selectedRecord.state || ""}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-neutral-500 font-mono uppercase">
                    Submitted
                  </span>
                  <p className="text-white font-medium">
                    {selectedRecord.submittedAt
                      ? new Date(selectedRecord.submittedAt).toLocaleString(
                          "en-NG",
                        )
                      : "N/A"}
                  </p>
                </div>
                {selectedRecord.notes && (
                  <div className="col-span-2 space-y-1">
                    <span className="text-neutral-500 font-mono uppercase">
                      Admin Notes
                    </span>
                    <p className="text-white font-medium">
                      {selectedRecord.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Notes input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Review Notes
                </label>
                <textarea
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Add notes for this review action..."
                  className="w-full h-20 px-3 py-2 bg-[#090A0C] border border-white/5 rounded-xl text-xs text-white outline-none focus:border-[#E2B93B]/40 transition-all resize-none"
                />
              </div>

              {/* Action buttons */}
              {(selectedRecord.status === "SUBMITTED" ||
                selectedRecord.status === "UNDER_REVIEW") && (
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => handleAction(selectedRecord.id, "APPROVE")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve
                  </Button>
                  <Button
                    onClick={() => handleAction(selectedRecord.id, "REJECT")}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-9 px-4"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" /> Reject
                  </Button>
                  {selectedRecord.status === "SUBMITTED" && (
                    <Button
                      onClick={() => handleAction(selectedRecord.id, "FLAG")}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-9 px-4"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1.5" /> Flag for
                      Review
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
