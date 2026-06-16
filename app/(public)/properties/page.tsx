"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { PropertiesGrid } from "@/components/dashboard/properties-grid";
import { InvestmentFilters } from "@/components/dashboard/investment-filters";
import { Map, List } from "lucide-react";
import propertiesData from "@/data/properties.json";
import { useRouter } from "next/navigation";

// Dynamically import the multi-property map (client-side only)
const MultiPropertyMap = dynamic(
  () => import("@/components/maps/multi-property-map"),
  { ssr: false }
);

export default function PropertiesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    category: "ALL",
    lifecycle: "ALL",
    region: "ALL",
  });
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const allProperties = propertiesData as Array<{
    id: string;
    title: string;
    location: string;
    region: string;
    category: string;
    lifecycle: string;
    lat: number;
    lng: number;
    image: string;
    tokenPriceUSD: number;
    tokenPriceNGN: number;
    totalValueUSD: number;
    totalValueNGN: number;
    expectedReturn: number;
    rentalYield: number;
    availableTokens: number;
    totalTokens: number;
    funded: number;
    images: string[];
    features: string[];
    documents: string[];
  }>;

  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      const matchesSearch =
        filters.search === "" ||
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === "ALL" || property.category === filters.category;
      const matchesLifecycle = filters.lifecycle === "ALL" || property.lifecycle === filters.lifecycle;
      const matchesRegion = filters.region === "ALL" || property.region === filters.region;
      return matchesSearch && matchesCategory && matchesLifecycle && matchesRegion;
    });
  }, [filters, allProperties]);

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

  // Map properties for the multi-pin map
  const mapProperties = useMemo(() => {
    return filteredProperties.map((p) => ({
      id: p.id,
      title: p.title,
      lat: p.lat,
      lng: p.lng,
      location: p.location,
      tokenPriceUSD: p.tokenPriceUSD,
      expectedReturn: p.expectedReturn,
      funded: p.totalTokens > 0
        ? Math.round(((p.totalTokens - p.availableTokens) / p.totalTokens) * 100)
        : 0,
      image: p.image,
    }));
  }, [filteredProperties]);

  const centerLat = filteredProperties.length > 0 
    ? filteredProperties.reduce((sum, p) => sum + p.lat, 0) / filteredProperties.length 
    : 6.45;
  const centerLng = filteredProperties.length > 0 
    ? filteredProperties.reduce((sum, p) => sum + p.lng, 0) / filteredProperties.length 
    : 3.4;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <PublicNav />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Investment <span className="text-gradient-gold">Properties</span></h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse our curated selection of premium tokenized real estate assets. 
              {filteredProperties.length} {filteredProperties.length === 1 ? "property" : "properties"} available.
            </p>
          </div>
          <InvestmentFilters onFilterChange={setFilters} />

          {/* View Toggle: Grid / Map */}
          <div className="flex items-center gap-2 mt-6 mb-4">
            <div className="flex gap-1 bg-[#0D0E12] border border-white/5 p-1 rounded-xl font-mono text-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold flex items-center gap-1.5 ${
                  viewMode === "grid"
                    ? "bg-white/10 text-white"
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                <List className="w-3.5 h-3.5" /> Grid
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-3 py-1.5 rounded-lg transition-all font-bold flex items-center gap-1.5 ${
                  viewMode === "map"
                    ? "bg-white/10 text-white"
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                <Map className="w-3.5 h-3.5" /> Map
              </button>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">
              {filteredProperties.length} asset{filteredProperties.length !== 1 ? "s" : ""} displayed
            </span>
          </div>

          {/* Map View — individual pins for each property */}
          {viewMode === "map" && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-white/5 bg-[#0D0E12]">
              <div className="p-4 border-b border-white/5">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Map className="w-4 h-4 text-[#E2B93B]" />
                  All Properties — {filteredProperties.length} Pins
                </h3>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                  Click a pin to view property details. Scroll to zoom.
                </p>
              </div>
              <MultiPropertyMap
                properties={mapProperties}
                centerLat={centerLat}
                centerLng={centerLng}
                onPropertyClick={(id) => router.push(`/invest/${id}`)}
              />
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="mt-4">
              <PropertiesGrid properties={dynamicProperties} />
            </div>
          )}

          {filteredProperties.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No properties match your filters.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}