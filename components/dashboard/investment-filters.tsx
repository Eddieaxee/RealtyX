"use client";

import { useState, useCallback } from "react";
import { Search, MapPin, Building2, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Support BOTH interfaces: separate props (from invest page) and onFilterChange (from public page)
interface InvestmentFiltersProps {
  onFilterChange?: (filters: {
    search: string;
    category: string;
    lifecycle: string;
    region: string;
  }) => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  selectedCategory?: string;
  onCategorySelect?: (value: string) => void;
  selectedLifecycle?: string;
  onLifecycleSelect?: (value: string) => void;
  selectedRegion?: string;
  onRegionSelect?: (value: string) => void;
}

export function InvestmentFilters({
  onFilterChange,
  searchQuery: externalSearch,
  onSearchChange: externalSearchChange,
  selectedCategory: externalCategory,
  onCategorySelect: externalCategorySelect,
  selectedLifecycle: externalLifecycle,
  onLifecycleSelect: externalLifecycleSelect,
  selectedRegion: externalRegion,
  onRegionSelect: externalRegionSelect,
}: InvestmentFiltersProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalCategory, setInternalCategory] = useState("ALL");
  const [internalLifecycle, setInternalLifecycle] = useState("ALL");
  const [internalRegion, setInternalRegion] = useState("ALL");
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if we're in "external" mode (invest page) or "internal" mode (public page)
  const isExternalMode = !!externalSearchChange;

  const searchQuery = isExternalMode ? externalSearch || "" : internalSearch;
  const selectedCategory = isExternalMode ? externalCategory || "ALL" : internalCategory;
  const selectedLifecycle = isExternalMode ? externalLifecycle || "ALL" : internalLifecycle;
  const selectedRegion = isExternalMode ? externalRegion || "ALL" : internalRegion;

  const emitFilters = useCallback(
    (updates: Partial<{ search: string; category: string; lifecycle: string; region: string }>) => {
      if (!isExternalMode && onFilterChange) {
        onFilterChange({
          search: updates.search ?? searchQuery,
          category: updates.category ?? selectedCategory,
          lifecycle: updates.lifecycle ?? selectedLifecycle,
          region: updates.region ?? selectedRegion,
        });
      }
    },
    [searchQuery, selectedCategory, selectedLifecycle, selectedRegion, onFilterChange, isExternalMode]
  );

  const handleSearch = (value: string) => {
    if (isExternalMode && externalSearchChange) {
      externalSearchChange(value);
    } else {
      setInternalSearch(value);
      emitFilters({ search: value });
    }
  };

  const handleCategory = (id: string) => {
    if (isExternalMode && externalCategorySelect) {
      externalCategorySelect(id);
    } else {
      setInternalCategory(id);
      emitFilters({ category: id });
    }
  };

  const handleLifecycle = (id: string) => {
    if (isExternalMode && externalLifecycleSelect) {
      externalLifecycleSelect(id);
    } else {
      setInternalLifecycle(id);
      emitFilters({ lifecycle: id });
    }
  };

  const handleRegion = (id: string) => {
    if (isExternalMode && externalRegionSelect) {
      externalRegionSelect(id);
    } else {
      setInternalRegion(id);
      emitFilters({ region: id });
    }
  };

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

  const activeFilterCount = [selectedCategory !== "ALL", selectedLifecycle !== "ALL", selectedRegion !== "ALL"].filter(Boolean).length;

  const clearAll = () => {
    if (isExternalMode) {
      externalSearchChange?.("");
      externalCategorySelect?.("ALL");
      externalLifecycleSelect?.("ALL");
      externalRegionSelect?.("ALL");
    } else {
      setInternalSearch("");
      setInternalCategory("ALL");
      setInternalLifecycle("ALL");
      setInternalRegion("ALL");
      emitFilters({ search: "", category: "ALL", lifecycle: "ALL", region: "ALL" });
    }
  };

  return (
    <div className="space-y-4 w-full bg-[#0D0E12]/90 p-5 rounded-2xl border border-white/5 backdrop-blur-md shadow-xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search properties by name, area, or region..."
          className="pl-11 h-11 bg-[#090A0C] border-white/5 text-sm text-white placeholder-neutral-500 rounded-xl focus-visible:ring-1 focus-visible:ring-[#E2B93B]/30 focus-visible:border-[#E2B93B]/30 focus-visible:ring-offset-0 transition-all"
        />
      </div>

      {/* Filter Toggle for Mobile */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors lg:hidden"
      >
        <Filter className="w-3.5 h-3.5" />
        Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>

      {/* Filter Sections */}
      <div className={`space-y-4 ${isExpanded ? "block" : "hidden lg:block"}`}>
        {/* Asset Sector Class */}
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
                onClick={() => handleCategory(cat.id)}
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

        {/* Asset Lifecycle Stage & Regional Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
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
                  onClick={() => handleLifecycle(life.id)}
                  className={`text-[11px] font-mono px-3 h-7 rounded-lg transition-all ${
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

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-500" /> Regional/Zonal Matrix
            </span>
            <div className="flex flex-wrap gap-1.5">
              {regions.map((reg) => (
                <Button
                  key={reg.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRegion(reg.id)}
                  className={`text-[11px] font-bold px-3 h-7 rounded-lg transition-all ${
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

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#E2B93B] transition-colors"
          >
            <X className="w-3 h-3" /> Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}