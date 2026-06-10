"use client";

import { useState, useMemo } from "react";
import { InvestmentFilters } from "@/components/dashboard/investment-filters";
import { PropertiesGrid } from "@/components/dashboard/properties-grid";
import { ShieldCheck, Layers3 } from "lucide-react";

// Production mock dataset mapping the localized structure accurately
const institutionalProperties = [
  {
    id: "eko-atlantic-alpha",
    title: "Eko Atlantic High-Rise Alpha",
    location: "Marina District, Victoria Island, Lagos",
    region: "VI",
    category: "COMMERCIAL",
    lifecycle: "UNDER_CONSTRUCTION" as const,
    currentMilestone: "Piling & Substructure",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    tokenPriceNGN: 50000,
    expectedReturn: 16.4,
    rentalYield: 9.2,
    availableTokens: 14200,
    totalTokens: 50000,
    funded: 85,
  },
  {
    id: "ikoyi-luxury-residences",
    title: "Ikoyi Luxury Residential Tower",
    location: "Old Ikoyi, Lagos",
    region: "IKOYI",
    category: "RESIDENTIAL",
    lifecycle: "COMPLETED" as const,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    tokenPriceNGN: 100000,
    expectedReturn: 14.8,
    rentalYield: 8.1,
    availableTokens: 4500,
    totalTokens: 25000,
    funded: 72,
  },
  {
    id: "maitama-commercial-workspace",
    title: "Maitama Corporate Suites",
    location: "Maitama District, Abuja",
    region: "ABUJA",
    category: "COMMERCIAL",
    lifecycle: "COMPLETED" as const,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    tokenPriceNGN: 75000,
    expectedReturn: 13.2,
    rentalYield: 7.8,
    availableTokens: 18400,
    totalTokens: 40000,
    funded: 65,
  },
  {
    id: "lekki-logistics-hub",
    title: "Lekki Phase 1 Fulfillment Hub",
    location: "Lekki Phase 1, Lagos",
    region: "LEKKI",
    category: "INFRASTRUCTURE",
    lifecycle: "UNDER_CONSTRUCTION" as const,
    currentMilestone: "Superstructure Framing",
    image:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
    tokenPriceNGN: 25000,
    expectedReturn: 22.1,
    rentalYield: 11.5,
    availableTokens: 9600,
    totalTokens: 80000,
    funded: 88,
  },
];

export default function InvestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLifecycle, setSelectedLifecycle] = useState("ALL");
  const [selectedRegion, setSelectedRegion] = useState("ALL");

  // Core functional mapping filtering state changes immediately down to grid views
  const filteredProperties = useMemo(() => {
    return institutionalProperties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" || property.category === selectedCategory;
      const matchesLifecycle =
        selectedLifecycle === "ALL" || property.lifecycle === selectedLifecycle;
      const matchesRegion =
        selectedRegion === "ALL" || property.region === selectedRegion;

      return (
        matchesSearch && matchesCategory && matchesLifecycle && matchesRegion
      );
    });
  }, [searchQuery, selectedCategory, selectedLifecycle, selectedRegion]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      {/* Structural Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
            <Layers3 className="w-4 h-4" /> Capital Allocation Pipelines
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Asset Marketplace
          </h1>
          <p className="text-xs text-neutral-400 max-w-2xl">
            Acquire audited fractional compliance placements in high-yield
            commercial and residential infrastructure across key African urban
            hubs.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[11px] font-mono text-emerald-400 self-start md:self-center backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SEC Compliant
          SEC/RI/0082
        </div>
      </div>

      {/* Synchronized State Control Block */}
      <InvestmentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        selectedLifecycle={selectedLifecycle}
        onLifecycleSelect={setSelectedLifecycle}
        selectedRegion={selectedRegion}
        onRegionSelect={setSelectedRegion}
      />

      {/* Pipeline Asset Grid */}
      <PropertiesGrid
        properties={filteredProperties.map((p) => ({
          ...p,
          tokenPrice: p.tokenPriceNGN,
        }))}
      />
    </div>
  );
}
