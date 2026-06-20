"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Landmark, FileText, Shield, CheckCircle, AlertTriangle, X,
  ChevronRight, Clock, BookOpen, Scale, FileCheck,
  Globe, Search, Eye, Download, Calendar,
} from "lucide-react";

interface Regulation {
  id: string;
  name: string;
  category: string;
  status: "compliant" | "review" | "non_compliant" | "pending";
  updated: string;
  description: string;
  requirements: string[];
  documents: string[];
  authority: string;
  jurisdiction: string;
}

const regulations: Regulation[] = [
  {
    id: "kyc-aml",
    name: "KYC / AML Policy",
    category: "Identity & Fraud Prevention",
    status: "compliant",
    updated: "2024-01-10",
    description: "Know Your Customer and Anti-Money Laundering procedures ensuring all users are properly verified before transacting on the platform.",
    requirements: ["Identity verification for all users", "Transaction monitoring", "Suspicious activity reporting", "Record keeping (5+ years)"],
    documents: ["KYC Policy Document v2.3", "AML Procedures Manual", "Risk Assessment Report Q4"],
    authority: "SEC Nigeria / NFIU",
    jurisdiction: "Nigeria",
  },
  {
    id: "ndpr",
    name: "Data Protection (NDPR)",
    category: "Privacy & Data Security",
    status: "compliant",
    updated: "2024-01-08",
    description: "Nigeria Data Protection Regulation compliance ensuring user data is collected, stored, and processed securely with consent.",
    requirements: ["User consent for data collection", "Data encryption at rest and transit", "Data breach notification procedures", "Data subject access requests"],
    documents: ["Privacy Policy Document", "Data Processing Register", "DPA with Third Parties"],
    authority: "NDPC (Nigeria Data Protection Commission)",
    jurisdiction: "Nigeria",
  },
  {
    id: "sec-regulations",
    name: "SEC Digital Assets Rules",
    category: "Securities & Tokenization",
    status: "review",
    updated: "2024-02-05",
    description: "Securities and Exchange Commission rules governing digital asset offerings, tokenized securities, and investment platforms.",
    requirements: ["Registration of digital asset offerings", "Investor protection disclosures", "Regular financial reporting", "Audit trail maintenance"],
    documents: ["SEC Filing Statement", "Token Classification Report", "Investor Disclosure Document"],
    authority: "SEC Nigeria",
    jurisdiction: "Nigeria",
  },
  {
    id: "financial-reporting",
    name: "Financial Reporting Standards",
    category: "Finance & Audit",
    status: "compliant",
    updated: "2024-01-01",
    description: "International Financial Reporting Standards (IFRS) compliance for transparent financial reporting and audit trails.",
    requirements: ["Monthly financial statements", "Annual external audit", "Investor fund segregation", "Revenue recognition compliance"],
    documents: ["Audited Financials FY2024", "Monthly Performance Reports", "Audit Committee Charter"],
    authority: "FINRA / SEC",
    jurisdiction: "International",
  },
  {
    id: "blockchain-compliance",
    name: "Blockchain & Smart Contract Standards",
    category: "Technology & Security",
    status: "pending",
    updated: "2024-02-10",
    description: "Compliance framework for smart contract deployments, blockchain transactions, and decentralized operations.",
    requirements: ["Smart contract audits", "Blockchain transaction monitoring", "Wallet address screening", "Gas fee transparency"],
    documents: ["Smart Contract Audit Report", "Blockchain Compliance Framework", "Wallet Screening Procedures"],
    authority: "Internal Compliance",
    jurisdiction: "Global",
  },
];

const complianceStats = [
  { label: "Compliant", value: regulations.filter(r => r.status === "compliant").length, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Under Review", value: regulations.filter(r => r.status === "review").length, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Non-Compliant", value: regulations.filter(r => r.status === "non_compliant").length, icon: X, color: "text-red-400", bg: "bg-red-500/10" },
  { label: "Pending", value: regulations.filter(r => r.status === "pending").length, icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Total Policies", value: regulations.length, icon: Shield, color: "text-purple-400", bg: "bg-purple-500/10" },
];

const statusBadge: Record<string, string> = {
  compliant: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  review: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  non_compliant: "text-red-400 bg-red-500/10 border-red-500/20",
  pending: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function AdminCompliancePage() {
  const [search, setSearch] = useState("");
  const [selectedReg, setSelectedReg] = useState<Regulation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const filtered = regulations.filter(r => {
    const matchesSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.authority.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
          <Landmark className="w-3.5 h-3.5" /> Compliance & Regulatory
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          Regulatory Compliance Center
        </h1>
        <p className="text-neutral-500 mt-1 text-sm">Track regulatory status, manage compliance requirements, and view audit trail</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {complianceStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
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

      {/* Compliance Overview Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400">Compliance Score</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {Math.round((regulations.filter(r => r.status === "compliant").length / regulations.length) * 100)}%
          </div>
          <div className="text-[10px] text-neutral-500 mt-1">Overall regulatory compliance</div>
          <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              style={{ width: `${(regulations.filter(r => r.status === "compliant").length / regulations.length) * 100}%` }} />
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-white/5 bg-[#0D0E12]">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-[#E2B93B]" />
            <span className="text-xs font-bold text-[#E2B93B]">Last Audit</span>
          </div>
          <div className="text-lg font-bold text-white">January 2024</div>
          <div className="text-[10px] text-neutral-500 mt-1">Next audit: March 2024</div>
        </div>
        <div className="p-4 rounded-2xl border border-white/5 bg-[#0D0E12]">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-400">Jurisdictions</span>
          </div>
          <div className="text-lg font-bold text-white">Nigeria & Global</div>
          <div className="text-[10px] text-neutral-500 mt-1">SEC, NDPR, IFRS compliant</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-[#13161C] border border-white/5 rounded-xl px-3 h-10">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input type="text" placeholder="Search regulations..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none w-full font-mono" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#13161C] border border-white/5 text-xs text-white font-mono outline-none">
          <option value="ALL">All Status</option>
          <option value="compliant">Compliant</option>
          <option value="review">Under Review</option>
          <option value="non_compliant">Non-Compliant</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Regulations List */}
      <div className="space-y-3">
        {filtered.map((reg, idx) => (
          <motion.div key={reg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            className="rounded-2xl border border-white/5 bg-[#0D0E12] p-4 hover:border-[#E2B93B]/20 transition-all cursor-pointer"
            onClick={() => setSelectedReg(reg)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E2B93B]/20 to-[#B89221]/10 border border-[#E2B93B]/20 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-[#E2B93B]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white">{reg.name}</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{reg.category}</div>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{reg.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusBadge[reg.status]}`}>
                      {reg.status === "compliant" ? "COMPLIANT" : reg.status === "review" ? "UNDER REVIEW" : reg.status === "non_compliant" ? "NON-COMPLIANT" : "PENDING"}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Updated {reg.updated}
                    </span>
                    <span className="text-[9px] text-neutral-500 font-mono">{reg.authority}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-600 shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={() => setSelectedReg(null)}>
          <div className="w-full max-w-2xl rounded-2xl border border-white/5 bg-[#0D0E12] shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 flex items-center justify-center">
                  <Scale className="w-5 h-5 text-[#E2B93B]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedReg.name}</h2>
                  <p className="text-xs text-neutral-500">{selectedReg.category}</p>
                </div>
              </div>
              <button onClick={() => setSelectedReg(null)} className="text-neutral-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Status & Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 mb-1">Status</div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${statusBadge[selectedReg.status]}`}>
                    {selectedReg.status === "compliant" ? "COMPLIANT" : selectedReg.status === "review" ? "UNDER REVIEW" : selectedReg.status === "non_compliant" ? "NON-COMPLIANT" : "PENDING"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 mb-1">Authority</div>
                  <div className="text-xs text-white font-mono">{selectedReg.authority}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 mb-1">Jurisdiction</div>
                  <div className="text-xs text-white font-mono">{selectedReg.jurisdiction}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 mb-1">Last Updated</div>
                  <div className="text-xs text-white font-mono">{selectedReg.updated}</div>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-[#090A0C] border border-white/5">
                <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-[#E2B93B]" /> Description
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">{selectedReg.description}</p>
              </div>

              {/* Requirements */}
              <div className="p-4 rounded-xl bg-[#090A0C] border border-white/5">
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-[#E2B93B]" /> Requirements
                </h3>
                <div className="space-y-2">
                  {selectedReg.requirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs text-neutral-300">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="p-4 rounded-xl bg-[#090A0C] border border-white/5">
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[#E2B93B]" /> Related Documents
                </h3>
                <div className="space-y-2">
                  {selectedReg.documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-xs text-neutral-300">{doc}</span>
                      </div>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-500 hover:text-white transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/5">
                {selectedReg.status === "review" || selectedReg.status === "pending" ? (
                  <button className="flex-1 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20 transition-all">
                    <CheckCircle className="w-4 h-4 inline mr-2" /> Mark as Compliant
                  </button>
                ) : selectedReg.status === "non_compliant" ? (
                  <button className="flex-1 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-sm hover:bg-amber-500/20 transition-all">
                    <AlertTriangle className="w-4 h-4 inline mr-2" /> Create Remediation Plan
                  </button>
                ) : (
                  <button className="flex-1 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-sm hover:bg-blue-500/20 transition-all">
                    <Download className="w-4 h-4 inline mr-2" /> Download Compliance Report
                  </button>
                )}
                <button onClick={() => setSelectedReg(null)}
                  className="py-3 px-6 rounded-xl bg-white/5 text-neutral-400 font-bold text-sm hover:bg-white/10 transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}