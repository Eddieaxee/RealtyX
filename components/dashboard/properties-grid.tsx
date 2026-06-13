"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, TrendingUp, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/currency-context";
import "./properties-grid.css";

const properties = [
  {
    id: "eko-atlantic-alpha",
    title: "Eko Atlantic High-Rise Alpha",
    location: "Victoria Island, Lagos",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
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
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    tokenPrice: 150000,
    expectedReturn: 17.5,
    rentalYield: 10.2,
    availableTokens: 11000,
    totalTokens: 50000,
    funded: 78,
  },
];

interface PropertyItem {
  id: string;
  title: string;
  location: string;
  image: string;
  tokenPrice: number;
  expectedReturn: number;
  rentalYield: number;
  availableTokens: number;
  totalTokens: number;
  funded: number;
}
export function PropertiesGrid({
  properties: externalProperties,
}: { properties?: PropertyItem[] } = {}) {
  const { formatValue } = useCurrency();
  const displayProperties = externalProperties ?? properties;

  function getProgressClass(p: number) {
    const val = Math.max(0, Math.min(100, Math.round(p / 5) * 5));
    return `progress-fill-${val}`;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayProperties.map((property, i) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="group relative rounded-2xl overflow-hidden border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md hover:border-[#E2B93B]/20 transition-all duration-300 shadow-2xl flex flex-col justify-between"
        >
          {/* Card Top Banner Area */}
          <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
            <Image
              src={property.image}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-transparent to-transparent" />
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              Primary Sale
            </div>
          </div>

          {/* Card Body Core Metadata Segment */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-white tracking-tight group-hover:text-[#E2B93B] transition-colors line-clamp-1">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="truncate">{property.location}</span>
              </div>
            </div>

            {/* Yield Projections Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-xl bg-[#13161C]/50 border border-white/5 space-y-0.5">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
                  Expected ARR
                </div>
                <div className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                  {property.expectedReturn}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#13161C]/50 border border-white/5 space-y-0.5">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
                  Rental Yield
                </div>
                <div className="text-xs font-bold font-mono text-white">
                  {property.rentalYield}%
                </div>
              </div>
            </div>

            {/* Progress / Funding Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-500">
                  Capital Pool Allocation
                </span>
                <span className="text-sm font-mono text-neutral-400">
                  {property.funded}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-[#E2B93B] to-[#B89221] transition-all duration-500 ${getProgressClass(property.funded)}`}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-0.5">
                <span className="flex items-center gap-1">
                  <Layers className="w-2.5 h-2.5" /> Available Placement Units:
                </span>
                <span className="text-neutral-400 font-bold">
                  {property.availableTokens.toLocaleString()} /{" "}
                  {property.totalTokens.toLocaleString()}
                </span>
              </div>
            </div>
            {/* Call to Action Row */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  Unit Cost
                </div>
                <div className="text-sm font-bold font-mono text-white">
                  {formatValue(property.tokenPrice)}
                </div>
              </div>
<Link href={`/invest/${property.id}`}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#B89221] hover:to-[#917116] text-black font-bold text-xs px-4 rounded-xl shadow-lg transition-all duration-200 group/btn"
                >
                  Allocate{" "}
                  <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform stroke-[2.5]" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
