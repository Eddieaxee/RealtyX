"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Building2,
  ShieldCheck,
  FileText,
  Layers,
  CheckCircle2,
  Clock,
  DollarSign,
  Percent,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/currency-context";
import { InvestmentModal } from "@/components/invest/investment-modal";
import { PropertyMapSystem } from "@/components/maps/property-maps";
import propertiesData from "@/data/properties.json";
import { useParams } from "next/navigation";

interface PropertyDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  city: string;
  state: string;
  region: string;
  country: string;
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
  neighborhoodInsights: {
    walkScore: number;
    safetyIndex: string;
    transitAccess: string;
    infrastructure: { name: string; distance: string; type: string }[];
  };
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { formatValue } = useCurrency();
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const property = useMemo(() => {
    const found = (propertiesData as PropertyDetail[]).find(
      (p) => p.id === id || p.slug === id
    );
    if (!found) return null;

    // Dynamic calculations: totalTokens * tokenPriceUSD = totalValueUSD
    const calculatedTokenPriceUSD = found.tokenPriceUSD || 0;
    const calculatedTotalTokens = found.totalTokens || 0;
    const calculatedTotalValueUSD =
      calculatedTotalTokens * calculatedTokenPriceUSD;
    const calculatedTotalValueNGN =
      calculatedTotalValueUSD * (found.tokenPriceNGN && calculatedTokenPriceUSD
        ? found.tokenPriceNGN / calculatedTokenPriceUSD
        : 1520);
    const calculatedTokenPriceNGN =
      calculatedTokenPriceUSD * (found.tokenPriceNGN && calculatedTokenPriceUSD
        ? found.tokenPriceNGN / calculatedTokenPriceUSD
        : 1520);
    const fundedPercent =
      calculatedTotalTokens > 0
        ? Math.round(
            ((calculatedTotalTokens - (found.availableTokens || 0)) /
              calculatedTotalTokens) *
              100
          )
        : 0;

    return {
      ...found,
      tokenPriceUSD: calculatedTokenPriceUSD,
      tokenPriceNGN: calculatedTokenPriceNGN,
      totalValueUSD: calculatedTotalValueUSD,
      totalValueNGN: calculatedTotalValueNGN,
      funded: fundedPercent,
    };
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#090A0C] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Asset Not Found</h2>
          <p className="text-sm text-neutral-400">
            The property you are looking for does not exist or has been removed.
          </p>
          <Link href="/invest">
            <Button className="bg-[#E2B93B] hover:bg-[#B89221] text-black font-bold text-xs rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const lifecycleColor =
    property.lifecycle === "COMPLETED"
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
        <Link href="/invest" className="hover:text-white transition-colors">
          Marketplace
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white">{property.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${lifecycleColor}`}
            >
              {property.lifecycle.replace("_", " ")}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded border font-bold uppercase text-[#E2B93B] bg-[#E2B93B]/10 border-[#E2B93B]/20">
              {property.category}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <MapPin className="w-4 h-4 text-neutral-500" />
            <span>{property.location}</span>
            <span className="text-neutral-600">•</span>
            <span>{property.country}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/invest">
            <Button
              variant="outline"
              className="border-white/5 text-neutral-400 hover:text-white h-10 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>
          <Button
            onClick={() => setShowInvestModal(true)}
            className="bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-black font-bold text-xs uppercase tracking-wider rounded-xl h-10 px-6 shadow-lg shadow-[#E2B93B]/5"
          >
            Invest Now
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative h-[400px] rounded-2xl overflow-hidden bg-neutral-900">
          <Image
            src={property.images[activeImage] || property.image}
            alt={property.title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="text-xs font-mono text-neutral-300 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              {activeImage + 1} / {property.images.length}
            </div>
            <div className="flex gap-2">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeImage
                      ? "bg-[#E2B93B] w-6"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
              Investment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Token Price (USD)</span>
                <span className="text-sm font-bold text-white font-mono">
                  ${property.tokenPriceUSD}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Token Price (NGN)</span>
                <span className="text-sm font-bold text-white font-mono">
                  ₦{property.tokenPriceNGN.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Total Property Value</span>
                <span className="text-sm font-bold text-[#E2B93B] font-mono">
                  {formatValue(property.totalValueNGN)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Expected Return</span>
                <span className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {property.expectedReturn}% APY
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Rental Yield</span>
                <span className="text-sm font-bold text-white font-mono">
                  {property.rentalYield}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Min. Purchase</span>
                <span className="text-sm font-bold text-[#E2B93B] font-mono">
                  ${property.tokenPriceUSD} (1 token)
                </span>
              </div>
            </div>
          </div>

          {/* Funding Progress */}
          <div className="p-5 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Capital Pool</span>
              <span className="text-white font-bold">{property.funded}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#E2B93B] to-[#B89221]"
                style={{ width: `${property.funded}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
              <span>
                <Layers className="w-2.5 h-2.5 inline mr-1" />
                {property.availableTokens.toLocaleString()} available
              </span>
              <span>{property.totalTokens.toLocaleString()} total</span>
            </div>
          </div>

          <Button
            onClick={() => setShowInvestModal(true)}
            className="w-full bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-black font-bold text-xs uppercase tracking-wider rounded-xl h-11 shadow-lg shadow-[#E2B93B]/5"
          >
            Invest in This Property
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#E2B93B]" /> Property Overview
        </h3>
        <p className="text-sm text-neutral-400 leading-relaxed">
          {property.description}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
            <span className="text-[9px] text-neutral-500 block uppercase">
              Milestone
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {property.currentMilestone}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
            <span className="text-[9px] text-neutral-500 block uppercase">
              Completion
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {property.completionPercentage}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
            <span className="text-[9px] text-neutral-500 block uppercase">
              Region
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {property.region}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#090A0C] border border-white/5">
            <span className="text-[9px] text-neutral-500 block uppercase">
              Category
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {property.category}
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="p-6 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Star className="w-4 h-4 text-[#E2B93B]" /> Key Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {property.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#090A0C]/50 border border-white/5 text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E2B93B] shrink-0" />
              <span className="text-neutral-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div className="p-6 rounded-2xl border border-white/5 bg-[#0D0E12] space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#E2B93B]" /> Legal Documents
        </h3>
        <div className="space-y-2">
          {property.documents.map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#090A0C]/50 border border-white/5"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-xs text-neutral-300">{doc}</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Verified
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#E2B93B]" /> Location & Neighborhood
        </h3>
        <PropertyMapSystem
          lat={property.lat}
          lng={property.lng}
          propertyName={property.title}
          neighborhood={property.location}
          neighborhoodInsights={property.neighborhoodInsights}
        />
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <InvestmentModal
          property={{
            id: property.id,
            title: property.title,
            tokenPriceUSD: property.tokenPriceUSD,
            tokenPriceNGN: property.tokenPriceNGN,
            availableTokens: property.availableTokens,
            totalTokens: property.totalTokens,
            expectedReturn: property.expectedReturn,
            rentalYield: property.rentalYield,
            location: property.location,
            image: property.image,
          }}
          onClose={() => setShowInvestModal(false)}
        />
      )}
    </div>
  );
}