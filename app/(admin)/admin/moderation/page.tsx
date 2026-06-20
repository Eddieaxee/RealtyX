"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search, Flag, ThumbsDown, MessageSquare,
  AlertTriangle, Shield, CheckCircle, Eye, X, Clock,
  FileText,
} from "lucide-react";

interface FlaggedContent {
  id: string;
  user: string;
  userName: string;
  type: string;
  description: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  date: string;
  contentUrl?: string;
  reportedBy?: string;
}

const initialFlags: FlaggedContent[] = [
  { id: "1", user: "user@example.com", userName: "John Doe", type: "Inappropriate Content", description: "User posted inappropriate content in property review section", status: "PENDING", priority: "HIGH", date: "2024-01-15", reportedBy: "admin@realtyx.io" },
  { id: "2", user: "another@example.com", userName: "Jane Smith", type: "Suspicious Activity", description: "Multiple rapid investment attempts from different IPs", status: "PENDING", priority: "CRITICAL", date: "2024-01-14", reportedBy: "system" },
  { id: "3", user: "investor3@example.com", userName: "Bob King", type: "Fake Document Upload", description: "KYC document appears to be digitally altered", status: "REVIEWED", priority: "HIGH", date: "2024-01-13", reportedBy: "kyc-system" },
  { id: "4", user: "trader4@example.com", userName: "Alice Wonder", type: "Spam", description: "Repeated promotional messages in community forum", status: "PENDING", priority: "MEDIUM", date: "2024-01-12", reportedBy: "moderator@realtyx.io" },
  { id: "5", user: "user5@example.com", userName: "Charlie Brown", type: "Misleading Information", description: "False claims about property returns in comments", status: "RESOLVED", priority: "LOW", date: "2024-01-11", reportedBy: "other-user@example.com" },
];

const flagStats = [
  { label: "Total Flags", value: initialFlags.length, icon: Flag, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Pending", value: initialFlags.filter(f => f.status === "PENDING").length, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Critical", value: initialFlags.filter(f => f.priority === "CRITICAL" && f.status === "PENDING").length, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
  { label: "Resolved", value: initialFlags.filter(f => f.status === "RESOLVED").length, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

const priorityColors: Record<string, string> = {
  LOW: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  HIGH: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  CRITICAL: "text-red-400 bg-red-500/10 border-red-500/20",
};

const statusColors: Record<string, string> = {
  PENDING: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  REVIEWED: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  RESOLVED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  DISMISSED: "text-neutral-500 bg-neutral-500/10 border-neutral-500/20",
};

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Inappropriate Content": Flag,
  "Suspicious Activity": AlertTriangle,
  "Fake Document Upload": FileText,
  "Spam": MessageSquare,
  "Misleading Information": AlertTriangle,
};

export default function AdminModerationPage() {
  const [flags, setFlags] = useState(initialFlags);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [selectedFlag, setSelectedFlag] = useState<FlaggedContent | null>(null);
  const [actionNotes, setActionNotes] = useState("");

  const updateFlag = (id: string, status: "REVIEWED" | "RESOLVED" | "DISMISSED") => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    setSelectedFlag(null);
    setActionNotes("");
  };

  const filteredFlags = useMemo(() => {
    let list = flags;
    if (filterStatus !== "ALL") list = list.filter(f => f.status === filterStatus);
    if (filterPriority !== "ALL") list = list.filter(f => f.priority === filterPriority);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f =>
        f.user.toLowerCase().includes(q) ||
        f.userName.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [flags, search, filterStatus, filterPriority]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B] mb-1">
          <Shield className="w-3.5 h-3.5" /> Content Moderation
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
          Moderation Center
        </h1>
        <p className="text-neutral-500 mt-1 text-sm">Review flagged content, user reports, and take enforcement actions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {flagStats.map((stat, i) => (
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

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Review Queue", count: `${flags.filter(f => f.status === "PENDING").length} items`, color: "text-amber-400" },
          { label: "High Priority", count: `${flags.filter(f => f.priority === "HIGH" || f.priority === "CRITICAL").length} items`, color: "text-red-400" },
          { label: "Actions Today", count: `${flags.filter(f => f.status !== "PENDING").length} completed`, color: "text-emerald-400" },
          { label: "Auto-Moderation", count: "Active", color: "text-blue-400" },
        ].map((action) => (
          <div key={action.label} className="p-3 rounded-xl bg-[#0D0E12] border border-white/5">
            <span className="text-xs font-bold text-white block">{action.label}</span>
            <span className={`text-[10px] font-mono ${action.color}`}>{action.count}</span>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-[#13161C] border border-white/5 rounded-xl px-3 h-10">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input type="text" placeholder="Search flags by user, type, or description..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none w-full font-mono" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#13161C] border border-white/5 text-xs text-white font-mono outline-none"
          title="Filter by status">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#13161C] border border-white/5 text-xs text-white font-mono outline-none"
          title="Filter by priority">
          <option value="ALL">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      {/* Flag Table */}
      <div className="rounded-2xl border border-white/5 bg-[#0D0E12] shadow-xl overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-7 gap-4 p-4 border-b border-white/5 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            <div className="col-span-2">User / Content</div>
            <div>Type</div>
            <div>Priority</div>
            <div>Status</div>
            <div>Date</div>
            <div className="text-right">Actions</div>
          </div>
          {filteredFlags.map((flag) => {
            const TypeIcon = typeIcons[flag.type] || Flag;
            return (
              <div key={flag.id}
                className="grid grid-cols-7 gap-4 p-4 border-b border-white/5 hover:bg-white/[0.02] items-center cursor-pointer"
                onClick={() => { setSelectedFlag(flag); setActionNotes(""); }}>
                <div className="col-span-2 flex items-center gap-3">
                  <TypeIcon className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{flag.userName}</div>
                    <div className="text-[10px] text-neutral-500 font-mono truncate">{flag.user}</div>
                  </div>
                </div>
                <div className="text-xs text-neutral-400">{flag.type}</div>
                <div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${priorityColors[flag.priority]}`}>
                    {flag.priority}
                  </span>
                </div>
                <div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${statusColors[flag.status]}`}>
                    {flag.status}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">{flag.date}</div>
                <div className="flex items-center justify-end gap-1">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedFlag(flag); setActionNotes(""); }}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors" title="View Details">
                    <Eye className="w-4 h-4 text-neutral-400" />
                  </button>
                  {flag.status === "PENDING" && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); updateFlag(flag.id, "RESOLVED"); }}
                        className="p-2 rounded-lg hover:bg-emerald-500/10" title="Resolve">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); updateFlag(flag.id, "DISMISSED"); }}
                        className="p-2 rounded-lg hover:bg-red-500/10" title="Dismiss">
                        <ThumbsDown className="w-4 h-4 text-red-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedFlag(null)}>
          <div className="w-full max-w-xl rounded-2xl border border-white/5 bg-[#0D0E12] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Flag Details</h2>
              <button onClick={() => setSelectedFlag(null)} className="text-neutral-500 hover:text-white" title="Close"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 mb-1">User</div>
                  <div className="text-sm text-white font-bold">{selectedFlag.userName}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">{selectedFlag.user}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 mb-1">Type</div>
                  <div className="text-sm text-white">{selectedFlag.type}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 mb-1">Priority</div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${priorityColors[selectedFlag.priority]}`}>
                    {selectedFlag.priority}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 mb-1">Status</div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${statusColors[selectedFlag.status]}`}>
                    {selectedFlag.status}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                <div className="text-[9px] text-neutral-500 mb-1">Description</div>
                <p className="text-sm text-neutral-300">{selectedFlag.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 mb-1">Reported By</div>
                  <div className="text-xs text-white font-mono">{selectedFlag.reportedBy || "System"}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                  <div className="text-[9px] text-neutral-500 mb-1">Date</div>
                  <div className="text-xs text-white font-mono">{selectedFlag.date}</div>
                </div>
              </div>
              {selectedFlag.status === "PENDING" && (
                <>
                  <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
                    <div className="text-[9px] text-neutral-500 mb-1">Action Notes</div>
                    <textarea value={actionNotes} onChange={(e) => setActionNotes(e.target.value)}
                      placeholder="Add notes about this action..." rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-[#0D0E12] border border-white/5 text-xs text-white outline-none focus:border-[#E2B93B]/50 font-mono" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => updateFlag(selectedFlag.id, "RESOLVED")}
                      className="flex-1 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20">
                      <CheckCircle className="w-4 h-4 inline mr-2" /> Resolve Flag
                    </button>
                    <button onClick={() => updateFlag(selectedFlag.id, "DISMISSED")}
                      className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20">
                      <ThumbsDown className="w-4 h-4 inline mr-2" /> Dismiss
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}