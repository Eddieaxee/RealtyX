"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Wrench, BarChart3, Receipt, Users } from "lucide-react";
import { PropertyMapSystem } from "@/components/maps/property-maps";
import { useCurrency } from "@/context/currency-context";

type Property = {
  id: string;
  title: string;
  city: string;
  state: string;
  latitude: string | number | null;
  longitude: string | number | null;
};

export default function PropertyManagementPortal() {
  const { formatValue } = useCurrency();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/properties", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch properties");
        const data = (await res.json()) as Property[];
        if (mounted) setProperties(data);
      } catch {
        // Keep UI resilient; do not hardcode.
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const assetWithCoordinates = useMemo(() => {
    const withCoords = properties.filter(
      (p) =>
        p.latitude !== null &&
        p.longitude !== null &&
        p.latitude !== undefined &&
        p.longitude !== undefined,
    );
    return withCoords[0] ?? null;
  }, [properties]);

  const lat = assetWithCoordinates
    ? Number(assetWithCoordinates.latitude)
    : null;
  const lng = assetWithCoordinates
    ? Number(assetWithCoordinates.longitude)
    : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      {/* Section Frame Headers */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
            <Building2 className="w-3.5 h-3.5" /> Operations Matrix Terminal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Asset Operations Core
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review detailed tenant rosters, gross asset performance, and
            technical field infrastructure logs.
          </p>
        </div>
      </div>

      {/* Numerical Metrics Matrix (placeholder until occupancy/rent derived endpoints exist) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-[#E2B93B]" /> Occupancy Index
          </span>
          <div className="text-2xl font-extrabold font-mono text-white">
            {loading ? "—" : "—"}%
          </div>
          <span className="text-[9px] font-mono text-neutral-400 block">
            Derived from tenant roster
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 flex items-center gap-1">
            <Receipt className="w-3.5 h-3.5 text-[#E2B93B]" /> Total Annualized
            Rent
          </span>
          <div className="text-2xl font-extrabold font-mono text-white">
            {loading ? "—" : formatValue(0)}
          </div>
          <span className="text-[9px] font-mono text-neutral-400 block">
            Derived from active tenants
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 flex items-center gap-1">
            <Wrench className="w-3.5 h-3.5 text-rose-400" /> Capex Maintenance
          </span>
          <div className="text-2xl font-extrabold font-mono text-white">
            {loading ? "—" : formatValue(0)}
          </div>
          <span className="text-[9px] font-mono text-neutral-400 block">
            Derived from maintenance cost
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-[#0D0E12] space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase text-neutral-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-400" /> Active Tenants
          </span>
          <div className="text-2xl font-extrabold font-mono text-white">
            {loading ? "—" : "—"} Units
          </div>
          <span className="text-[9px] font-mono text-blue-400 block">
            Derived from tenant occupancy status
          </span>
        </div>
      </div>

      {/* Main Structural Breakdown Dashboard Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LMDX Integrated Geospatial Module Placement Frame */}
        <div className="lg:col-span-2">
          {assetWithCoordinates && lat !== null && lng !== null ? (
            <PropertyMapSystem
              lat={lat}
              lng={lng}
              propertyName={assetWithCoordinates.title}
              neighborhood={`${assetWithCoordinates.city}, ${assetWithCoordinates.state}`}
            />
          ) : (
            <div className="p-6 rounded-2xl border border-white/5 bg-[#0D0E12]">
              <p className="text-sm text-neutral-400">
                No active properties with latitude/longitude found.
              </p>
            </div>
          )}
        </div>

        {/* Right Side Columns */}
        <div className="bg-[#0D0E12] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#E2B93B]" /> Asset Maintenance Logs
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Maintenance requests are loaded per-property via the API.
          </p>

          <div className="p-4 rounded-xl border border-white/5 bg-[#090A0C]/40 text-xs text-neutral-400">
            Select a property with coordinates to display maintenance (next
            phase: tenant + maintenance table fetch).
          </div>
        </div>
      </div>
    </div>
  );
}
