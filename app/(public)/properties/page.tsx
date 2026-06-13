"use client";

import { useState, useMemo } from "react";
import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { PropertiesGrid } from "@/components/dashboard/properties-grid";
import { InvestmentFilters } from "@/components/dashboard/investment-filters";

const allProperties = [
  {
    id: "eko-atlantic-alpha",
    title: "Eko Atlantic High-Rise Alpha",
    location: "Victoria Island, Lagos",
    region: "VI",
    category: "RESIDENTIAL",
    lifecycle: "COMPLETED",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    tokenPrice: 50000,
    expectedReturn: 16.4,
    rentalYield: 9.2,
    availableTokens: 14200,
    totalTokens: 50000,
    funded: 85,
  },
  {
    id: "ikoyi-luxury-residences",
    title: "Ikoyi Luxury Residential Tower",
    location: "Ikoyi, Lagos",
    region: "IKOYI",
    category: "RESIDENTIAL",
    lifecycle: "UNDER_CONSTRUCTION",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    tokenPrice: 100000,
    expectedReturn: 14.8,
    rentalYield: 8.1,
    availableTokens: 4500,
    totalTokens: 25000,
    funded: 72,
  },
  {
    id: "maitama-commercial-workspace",
    title: "Maitama Corporate Suites",
    location: "Maitama, Abuja",
    region: "ABUJA",
    category: "COMMERCIAL",
    lifecycle: "COMPLETED",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    tokenPrice: 75000,
    expectedReturn: 13.2,
    rentalYield: 7.8,
    availableTokens: 18400,
    totalTokens: 40000,
    funded: 65,
  },
  {
    id: "lekki-logistics-hub",
    title: "Lekki Phase 1 Fulfillment Hub",
    location: "Lekki, Lagos",
    region: "LEKKI",
    category: "INFRASTRUCTURE",
    lifecycle: "COMPLETED",
    image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
    tokenPrice: 25000,
    expectedReturn: 22.1,
    rentalYield: 11.5,
    availableTokens: 9600,
    totalTokens: 80000,
    funded: 88,
  },
  {
    id: "ikeja-medical-workspace",
    title: "GRA Medical Professional Suites",
    location: "Ikeja, Lagos",
    region: "LEKKI",
    category: "COMMERCIAL",
    lifecycle: "UNDER_CONSTRUCTION",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    tokenPrice: 40000,
    expectedReturn: 15.1,
    rentalYield: 8.7,
    availableTokens: 32000,
    totalTokens: 60000,
    funded: 45,
  },
  {
    id: "banana-island-marina-view",
    title: "Banana Island Waterfront Estate",
    location: "Banana Island, Lagos",
    region: "IKOYI",
    category: "RESIDENTIAL",
    lifecycle: "COMPLETED",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    tokenPrice: 150000,
    expectedReturn: 17.5,
    rentalYield: 10.2,
    availableTokens: 11000,
    totalTokens: 50000,
    funded: 78,
  },
];

export default function PropertiesPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "ALL",
    lifecycle: "ALL",
    region: "ALL",
  });

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
  }, [filters]);

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
          <div className="mt-8">
            <PropertiesGrid properties={filteredProperties} />
          </div>
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