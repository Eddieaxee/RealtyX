"use client";

import { Search, MapPin, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InvestmentFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  selectedLifecycle: string;
  onLifecycleSelect: (status: string) => void;
  selectedRegion: string;
  onRegionSelect: (region: string) => void;
}

export function InvestmentFilters({
  searchQuery = "",
  onSearchChange = () => {},
  selectedCategory = "ALL",
  onCategorySelect = () => {},
  selectedLifecycle = "ALL",
  onLifecycleSelect = () => {},
  selectedRegion = "ALL",
  onRegionSelect = () => {},
}: Partial<InvestmentFiltersProps> = {}) {
  const categories = [
    { id: "ALL", label: "All Sectors" },
    { id: "RESIDENTIAL", label: "Premium Residential" },
    { id: "COMMERCIAL", label: "Commercial Office/Retail" },
    { id: "INFRASTRUCTURE", label: "Infrastructural Hubs" },
  ];

  const lifecycles = [
    { id: "ALL", label: "All Lifecycles" },
    { id: "COMPLETED", label: "Completed (Instant Yield)" },
    { id: "UNDER_CONSTRUCTION", label: "Off-Plan (Milestone Phased)" },
  ];

  const regions = [
    { id: "ALL", label: "All Regions" },
    { id: "VI", label: "Victoria Island" },
    { id: "IKOYI", label: "Ikoyi" },
    { id: "LEKKI", label: "Lekki Corridor" },
    { id: "ABUJA", label: "FCT Abuja" },
  ];

  return (
    <div className="space-y-4 w-full bg-[#0D0E12]/90 p-5 rounded-2xl border border-white/5 backdrop-blur-md shadow-xl">
      {/* Search Input Box Area */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by institutional development asset title, area, region..."
          className="pl-11 h-11 bg-[#090A0C] border-white/5 text-sm text-white placeholder-neutral-500 rounded-xl focus-visible:ring-1 focus-visible:ring-[#E2B93B]/30 focus-visible:border-[#E2B93B]/30 focus-visible:ring-offset-0 transition-all"
        />
      </div>

      {/* Advanced Granular Filter Actions Row */}
      <div className="flex flex-col gap-3 pt-1">
        {/* Sector Grouping */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-[#E2B93B]" /> Asset Sector Class
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant="ghost"
                size="sm"
                onClick={() => onCategorySelect(cat.id)}
                className={`text-[11px] font-bold px-3.5 h-8 rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#E2B93B] text-black hover:bg-[#E2B93B]/90 shadow-md"
                    : "text-neutral-400 bg-white/5 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Structural Lifecycle and Geographical Target Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {/* Asset Lifecycle Stage */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
              Asset Lifecycle Stage
            </span>
            <div className="flex flex-wrap gap-1.5">
              {lifecycles.map((life) => (
                <Button
                  key={life.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onLifecycleSelect(life.id)}
                  className={`text-[11px] font-mono px-3 h-7.5 rounded-lg transition-all ${
                    selectedLifecycle === life.id
                      ? "border border-[#E2B93B]/30 bg-[#E2B93B]/10 text-[#E2B93B]"
                      : "text-neutral-400 bg-white/5 hover:text-white"
                  }`}
                >
                  {life.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Geographical Region Matrix */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-500" /> Regional Zoning
              Matrix
            </span>
            <div className="flex flex-wrap gap-1.5">
              {regions.map((reg) => (
                <Button
                  key={reg.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onRegionSelect(reg.id)}
                  className={`text-[11px] font-bold px-3 h-7.5 rounded-lg transition-all ${
                    selectedRegion === reg.id
                      ? "border border-neutral-400 text-white bg-white/5"
                      : "text-neutral-500 bg-white/5 hover:text-neutral-300"
                  }`}
                >
                  {reg.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
