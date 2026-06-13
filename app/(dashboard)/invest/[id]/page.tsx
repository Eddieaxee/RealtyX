"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  TrendingUp,
  Building2,
  ArrowLeft,
  Wallet,
  Shield,
  FileCheck,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyMapSystem } from "@/components/maps/property-maps";
import styles from "./page.module.css";

type DbProperty = {
  id: string;
  slug: string;
  title: string;
  description: string;
  city: string;
  state: string;
  latitude: string | number | null;
  longitude: string | number | null;
  images: string[];
  documents: string[];
  features: string[];
  totalValueNGN: string | number;
  tokenPriceNGN: string | number;
  expectedReturn: string | number | null;
  rentalYield: string | number | null;
  availableTokens: number;
  totalTokens: number;
  completionPercentage: string | number;
  publishedAt: string | Date | null;
};

function toNumberOrNull(v: string | number | null | undefined): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toNumber(v: string | number | null | undefined, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default function PropertyDetailPage() {
  const params = useParams();

  const [property, setProperty] = useState<DbProperty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/properties", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch properties");
        const list = (await res.json()) as DbProperty[];

        const idOrSlug = String((params as { id?: string }).id ?? "");
        const found =
          list.find((p) => p.id === idOrSlug) ??
          list.find((p) => p.slug === idOrSlug) ??
          null;

        if (mounted) setProperty(found);
      } catch {
        if (mounted) setProperty(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [params]);

  const primaryImage = useMemo(() => {
    if (!property?.images?.length) return null;
    return property.images[0];
  }, [property]);

  const lat = toNumberOrNull(property?.latitude);
  const lng = toNumberOrNull(property?.longitude);

  const expectedReturn = toNumber(property?.expectedReturn, 0);
  const rentalYield = toNumber(property?.rentalYield, 0);

  const totalValueNGN = toNumber(property?.totalValueNGN, 0);
  const tokenPriceNGN = toNumber(property?.tokenPriceNGN, 0);
  const completionPercentage = toNumber(property?.completionPercentage, 0);

  const progressWidthClass = useMemo(() => {
    const pct = Math.max(0, Math.min(100, Math.round(completionPercentage)));
    return styles[`progress-w-${pct}`] ?? "";
  }, [completionPercentage]);

  const backHref = "/invest";

  return (
    <div className="min-h-screen text-white bg-[#090A0C] py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-[#E2B93B] transition-colors group mb-2"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
        Back to Asset Pipeline
      </Link>

      {loading ? (
        <div className="p-6 rounded-2xl border border-white/5 bg-[#0D0E12] text-neutral-400">
          Loading asset…
        </div>
      ) : !property ? (
        <div className="p-6 rounded-2xl border border-white/5 bg-[#0D0E12] text-neutral-400">
          Asset not found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-96 rounded-2xl overflow-hidden border border-white/5 shadow-2xl"
            >
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={property.title}
                  fill
                  priority
                  className="object-cover opacity-90"
                />
              ) : (
                <div className="absolute inset-0 bg-white/5" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
                  {property.title}
                </h1>

                <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                  <MapPin className="w-4 h-4 text-[#E2B93B]" /> {property.city},{" "}
                  {property.state}
                </div>
              </div>
            </motion.div>

            <div className="p-6 rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md space-y-3 shadow-xl">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#E2B93B]" /> Asset Profile
                Summary
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                {property.description}
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white tracking-tight">
                Core Structural Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(property.features ?? []).map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#13161C]/40 border border-white/5 text-xs text-neutral-300"
                  >
                    <Building2 className="w-4 h-4 text-[#E2B93B] shrink-0" />
                    <span className="truncate font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white tracking-tight">
                Compliance & Audited Disclosures
              </h2>

              <div className="space-y-2">
                {(property.documents ?? []).map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#13161C]/40 border border-white/5 hover:border-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs text-neutral-300 font-medium truncate group-hover:text-white transition-colors">
                        {doc}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[11px] font-mono font-bold uppercase text-[#E2B93B] hover:text-[#B89221] hover:bg-white/5 rounded-lg px-3"
                      type="button"
                      onClick={() => {
                        // download wiring can be added later when document URLs exist
                      }}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-2xl border border-white/5 bg-[#0D0E12]/80 backdrop-blur-md shadow-2xl space-y-5"
            >
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Asset Valuation Base
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
                    ₦{totalValueNGN.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#13161C]/50 border border-white/5 space-y-0.5">
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
                      Target ARR
                    </div>
                    <div className="text-sm font-bold font-mono text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />{" "}
                      {expectedReturn}%
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#13161C]/50 border border-white/5 space-y-0.5">
                    <div className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500">
                      Rental Yield
                    </div>
                    <div className="text-sm font-bold font-mono text-white">
                      {rentalYield}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Unit Entry Cost
                    </div>
                    <div className="text-base font-bold font-mono text-[#E2B93B] mt-0.5">
                      ₦{tokenPriceNGN.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Available Units
                    </div>
                    <div className="text-sm font-bold font-mono text-neutral-300 mt-0.5">
                      {property.availableTokens.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                    <div
                      className={[
                        "h-full rounded-full bg-gradient-to-r from-[#E2B93B] to-[#B89221]",
                        styles.progressFill,
                        progressWidthClass,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-[10px] font-mono font-medium text-neutral-400">
                        Smart-contract security verified via external audits.
                      </span>
                    </div>

                    <Button className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#B89221] hover:to-[#917116] text-black font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                      <Wallet className="w-4 h-4 stroke-[2.5]" /> Initiate
                      Acquisition Order
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="bg-[#0D0E12] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              {lat !== null && lng !== null ? (
                <PropertyMapSystem
                  lat={lat}
                  lng={lng}
                  propertyName={property.title}
                  neighborhood={`${property.city}, ${property.state}`}
                />
              ) : (
                <div className="p-5 text-neutral-400 text-sm">
                  Coordinates not available for this property.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
