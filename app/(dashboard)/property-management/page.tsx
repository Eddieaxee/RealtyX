"use client";

import { useEffect, useState } from "react";
import { AddPropertyModal } from "@/components/admin/add-property-modal";
import { AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/currency-context";
import {
  Building2,
  Users,
  Wrench,
  Home,
  Plus,
  RefreshCw,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface Tenant {
  id: string;
  propertyId: string;
  tenantName: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmountNGN: string;
  occupancyStatus: string;
  property: { title: string; id: string } | null;
}

interface MaintenanceRequest {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  scheduledDate: string | null;
  estimatedCost: string | null;
  property: { title: string; id: string } | null;
  user: { id: string; name: string | null; email: string } | null;
}

interface TenantStats {
  totalTenants: number;
  activeTenants: number;
  vacancyRate: number;
  totalRentNGN: number;
}

interface MaintenanceStats {
  totalRequests: number;
  openRequests: number;
  resolvedRequests: number;
  totalEstimatedCost: number;
}

const priorityColors: Record<string, string> = {
  LOW: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  MEDIUM: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  HIGH: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  CRITICAL: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const statusColors: Record<string, string> = {
  REPORTED: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  SCHEDULED: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  IN_PROGRESS: "text-[#E2B93B] bg-[#E2B93B]/10 border-[#E2B93B]/20",
  RESOLVED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  CANCELLED: "text-neutral-400 bg-neutral-500/10 border-neutral-500/20",
};

export default function PropertyManagementPage() {
  const { formatValue } = useCurrency();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<
    MaintenanceRequest[]
  >([]);
  const [tStats, setTStats] = useState<TenantStats>({
    totalTenants: 0,
    activeTenants: 0,
    vacancyRate: 0,
    totalRentNGN: 0,
  });
  const [mStats, setMStats] = useState<MaintenanceStats>({
    totalRequests: 0,
    openRequests: 0,
    resolvedRequests: 0,
    totalEstimatedCost: 0,
  });
  const [activeTab, setActiveTab] = useState<"tenants" | "maintenance">(
    "tenants",
  );
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  async function fetchData() {
    try {
      const [tenantsRes, maintenanceRes] = await Promise.all([
        fetch("/api/property-management/tenants"),
        fetch("/api/property-management/maintenance"),
      ]);

      if (tenantsRes.ok) {
        const d = await tenantsRes.json();
        setTenants(d.tenants || []);
        if (d.stats) setTStats(d.stats);
      }

      if (maintenanceRes.ok) {
        const d = await maintenanceRes.json();
        setMaintenanceRequests(d.requests || []);
        if (d.stats) setMStats(d.stats);
      }
    } catch {
      console.error("Failed to fetch property management data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 text-[#E2B93B] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
            <Building2 className="w-3.5 h-3.5" /> Property Operations Hub
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Property Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage tenants, track maintenance, monitor occupancy, and oversee
            rent collection.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-black font-bold text-xs uppercase tracking-wider hover:from-[#B89221] hover:to-[#917116] transition-all"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-400" /> Total Tenants
          </span>
          <div className="text-2xl font-extrabold text-white">
            {tStats.totalTenants}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            {tStats.activeTenants} active leases
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-emerald-400" /> Occupancy Rate
          </span>
          <div className="text-2xl font-extrabold text-emerald-400">
            {(100 - tStats.vacancyRate).toFixed(1)}%
          </div>
          <span className="text-[9px] text-neutral-400 block">
            {tStats.vacancyRate.toFixed(1)}% vacancy
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[#E2B93B]" /> Monthly Rent
          </span>
          <div className="text-2xl font-extrabold text-white">
            {formatValue(tStats.totalRentNGN)}
          </div>
          <span className="text-[9px] text-[#E2B93B] block">
            Active rental income
          </span>
        </div>
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] font-mono space-y-1">
          <span className="text-[10px] text-neutral-500 font-bold uppercase flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-amber-400" /> Open Maintenance
          </span>
          <div className="text-2xl font-extrabold text-white">
            {mStats.openRequests}
          </div>
          <span className="text-[9px] text-neutral-400 block">
            {mStats.resolvedRequests} resolved
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-[#0D0E12] border border-white/5 p-1 rounded-xl font-mono text-xs w-fit">
        <button
          onClick={() => setActiveTab("tenants")}
          className={`px-4 py-2 rounded-lg transition-all font-bold flex items-center gap-2 ${
            activeTab === "tenants"
              ? "bg-white/10 text-white"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Tenants
        </button>
        <button
          onClick={() => setActiveTab("maintenance")}
          className={`px-4 py-2 rounded-lg transition-all font-bold flex items-center gap-2 ${
            activeTab === "maintenance"
              ? "bg-white/10 text-white"
              : "text-neutral-500 hover:text-white"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" /> Maintenance
        </button>
      </div>

      {/* Tenants Tab */}
      {activeTab === "tenants" && (
        <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E2B93B]" /> Tenant Directory
          </h3>
          {tenants.length > 0 ? (
            <div className="space-y-2 font-mono text-xs">
              {tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-sans text-xs">
                        {tenant.tenantName}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${
                          tenant.occupancyStatus === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {tenant.occupancyStatus}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 block">
                      {tenant.property?.title || "Unknown Property"} • Lease:{" "}
                      {new Date(tenant.leaseStart).toLocaleDateString()} -{" "}
                      {new Date(tenant.leaseEnd).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#E2B93B]">
                    {formatValue(Number(tenant.rentAmountNGN))}
                    <span className="text-[9px] text-neutral-500 font-normal">
                      /yr
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No tenants found. Add tenants to track occupancy and rent.
            </div>
          )}
        </div>
      )}

      {/* Maintenance Tab */}
      {activeTab === "maintenance" && (
        <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#E2B93B]" /> Maintenance Requests
          </h3>
          {maintenanceRequests.length > 0 ? (
            <div className="space-y-2 font-mono text-xs">
              {maintenanceRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-[#090A0C]/50 border border-white/5 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-sans text-xs">
                        {req.title}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${
                          statusColors[req.status] ||
                          "text-neutral-400 bg-neutral-500/10 border-neutral-500/20"
                        }`}
                      >
                        {req.status.replace("_", " ")}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase ${
                          priorityColors[req.priority] ||
                          "text-neutral-400 bg-neutral-500/10 border-neutral-500/20"
                        }`}
                      >
                        {req.priority}
                      </span>
                    </div>
                    {req.estimatedCost && (
                      <span className="text-[#E2B93B] font-bold">
                        Est. {formatValue(Number(req.estimatedCost))}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-neutral-500">
                    {req.property && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {req.property.title}
                      </span>
                    )}
                    {req.scheduledDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Scheduled:{" "}
                        {new Date(req.scheduledDate).toLocaleDateString()}
                      </span>
                    )}
                    {req.status === "RESOLVED" && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Resolved
                      </span>
                    )}
                    {(req.status === "REPORTED" ||
                      req.status === "SCHEDULED") && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <AlertTriangle className="w-3 h-3" /> Needs Attention
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {req.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No maintenance requests found. Log requests to track property
              upkeep.
            </div>
          )}
        </div>
      )}
      {/* Add Property Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddPropertyModal
            onClose={() => setShowAddModal(false)}
            onPropertyAdded={() => {
              fetchData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
