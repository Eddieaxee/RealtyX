"use client";

import { useState, useMemo } from "react";
import { InvestmentFilters } from "@/components/dashboard/investment-filters";
import { PropertiesGrid } from "@/components/dashboard/properties-grid";
import { ShieldCheck, Layers3 } from "lucide-react";
import propertiesData from "@/data/properties.json";

interface Property {
  id: string;
  title: string;
  location: string;
  region: string;
  category: string;
  lifecycle: string;
  currentMilestone: string;
  lat: number;
  lng: number;
  image: string;
  images: string[];
  tokenPriceUSD: number;
  tokenPriceNGN: number;
  totalValueNGN: number;
  totalValueUSD: number;
  expectedReturn: number;
  rentalYield: number;
  availableTokens: number;
  totalTokens: number;
  funded: number;
  completionPercentage: number;
  features: string[];
  documents: string[];
}

export default function InvestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLifecycle, setSelectedLifecycle] = useState("ALL");
  const [selectedRegion, setSelectedRegion] = useState("ALL");

  const institutionalProperties = propertiesData as Property[];

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
  }, [searchQuery, selectedCategory, selectedLifecycle, selectedRegion, institutionalProperties]);

  // Dynamic calculations for each property
  const dynamicProperties = useMemo(() => {
    return filteredProperties.map((p) => {
      const tokenPriceUSD = p.tokenPriceUSD || 0;
      const totalTokens = p.totalTokens || 0;
      const totalValueUSD = totalTokens * tokenPriceUSD;
      const fundedPercent = totalTokens > 0
        ? Math.round(((totalTokens - (p.availableTokens || 0)) / totalTokens) * 100)
        : 0;
      return {
        ...p,
        tokenPrice: p.tokenPriceNGN,
        totalValueUSD,
        funded: fundedPercent,
      };
    });
  }, [filteredProperties]);

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
        properties={dynamicProperties}
      />
    </div>
  );
}
