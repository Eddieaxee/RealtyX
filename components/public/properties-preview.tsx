"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/currency-context";
import { useEffect, useState } from "react";
import "./properties-preview.css";

interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  state: string;
  country: string;
  images: string[];
  totalValueUSD: number;
  tokenPriceUSD: number;
  expectedReturn: number | null;
  rentalYield: number | null;
  availableTokens: number;
  totalTokens: number;
  status: string;
  developmentStatus: string;
  completionPercentage: number;
}

type ApiProperty = Record<string, unknown>;

const FALLBACK_PROPERTIES: Property[] = [
  {
    id: "eko-atlantic-alpha",
    title: "Eko Atlantic High-Rise Alpha",
    location: "Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    ],
    totalValueUSD: 5000000,
    tokenPriceUSD: 50000,
    expectedReturn: 16.4,
    rentalYield: 9.2,
    availableTokens: 14200,
    totalTokens: 50000,
    status: "ACTIVE",
    developmentStatus: "ACTIVE",
    completionPercentage: 100,
  },
  {
    id: "ikoyi-luxury-residences",
    title: "Ikoyi Luxury Residential Tower",
    location: "Ikoyi, Lagos",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    ],
    totalValueUSD: 2500000,
    tokenPriceUSD: 100000,
    expectedReturn: 14.8,
    rentalYield: 8.1,
    availableTokens: 4500,
    totalTokens: 25000,
    status: "ACTIVE",
    developmentStatus: "UNDER_CONSTRUCTION",
    completionPercentage: 72,
  },
  {
    id: "maitama-commercial-workspace",
    title: "Maitama Corporate Suites",
    location: "Maitama, Abuja",
    city: "Abuja",
    state: "FCT",
    country: "Nigeria",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    ],
    totalValueUSD: 3000000,
    tokenPriceUSD: 75000,
    expectedReturn: 13.2,
    rentalYield: 7.8,
    availableTokens: 18400,
    totalTokens: 40000,
    status: "ACTIVE",
    developmentStatus: "PHASED_DEVELOPMENT",
    completionPercentage: 45,
  },
];

function normalizeProperty(p: ApiProperty): Property {
  const images =
    Array.isArray(p.images) && p.images.length > 0
      ? (p.images as string[])
      : typeof p.image === "string"
        ? [p.image]
        : typeof p.imageUrl === "string"
          ? [p.imageUrl]
          : [];

  const tokenPriceUSD =
    typeof p.tokenPriceUSD === "number"
      ? p.tokenPriceUSD
      : typeof p.tokenPrice === "number"
        ? p.tokenPrice
        : Number(p.tokenPriceUSD ?? p.tokenPrice ?? 0);

  const expectedReturn =
    typeof p.expectedReturn === "number" ? p.expectedReturn : null;

  const rentalYield = typeof p.rentalYield === "number" ? p.rentalYield : null;

  return {
    id: String(p.id ?? ""),
    title: String(p.title ?? ""),
    location: String(p.location ?? ""),
    city: String(p.city ?? ""),
    state: String(p.state ?? ""),
    country: String(p.country ?? ""),
    images,
    totalValueUSD: typeof p.totalValueUSD === "number" ? p.totalValueUSD : 0,
    tokenPriceUSD,
    expectedReturn,
    rentalYield,
    availableTokens:
      typeof p.availableTokens === "number" ? p.availableTokens : 0,
    totalTokens: typeof p.totalTokens === "number" ? p.totalTokens : 0,
    status: String(p.status ?? ""),
    developmentStatus: String(p.developmentStatus ?? ""),
    completionPercentage:
      typeof p.completionPercentage === "number" ? p.completionPercentage : 0,
  };
}

export function PropertiesPreview() {
  const { formatValue } = useCurrency();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await fetch("/api/properties");
        if (!res.ok) {
          setProperties(FALLBACK_PROPERTIES);
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        if (list.length === 0) {
          setProperties(FALLBACK_PROPERTIES);
          return;
        }

        const normalized = list
          .slice(0, 3)
          .map((raw) => normalizeProperty(raw as ApiProperty));

        setProperties(normalized);
      } catch {
        setProperties(FALLBACK_PROPERTIES);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Featured <span className="text-gradient-gold">Properties</span>
              </h2>
              <p className="text-muted-foreground max-w-lg">
                Hand-picked premium assets with strong fundamentals and verified
                returns.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-border/50 bg-card animate-pulse"
              >
                <div className="h-48 bg-white/5" />
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-8 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Featured <span className="text-gradient-gold">Properties</span>
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Hand-picked premium assets across Nigeria with strong fundamentals
              and verified returns.
            </p>
          </motion.div>
          <Link href="/properties" className="hidden sm:block">
            <Button variant="ghost" className="group">
              View All
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-gold-500/30 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={property.images?.[0] || "/og-image.svg"}
                  alt={property.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs font-medium text-green-400">
                  {property.developmentStatus === "UNDER_CONSTRUCTION"
                    ? "Under Construction"
                    : property.developmentStatus === "PHASED_DEVELOPMENT"
                      ? "Phased"
                      : "Active"}
                </div>
                {property.developmentStatus === "UNDER_CONSTRUCTION" && (
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-medium text-blue-400">
                    {property.completionPercentage}% Complete
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {property.location}, {property.country}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-lg bg-white/5">
                    <div className="text-xs text-muted-foreground mb-1">
                      Expected Return
                    </div>
                    <div className="text-sm font-semibold text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {property.expectedReturn ?? 0}%
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5">
                    <div className="text-xs text-muted-foreground mb-1">
                      Rental Yield
                    </div>
                    <div className="text-sm font-semibold">
                      {property.rentalYield ?? 0}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Token Price
                    </div>
                    <div className="font-semibold">
                      {formatValue(property.tokenPriceUSD)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Available
                    </div>
                    <div className="font-semibold text-sm">
                      {property.availableTokens.toLocaleString()} /{" "}
                      {property.totalTokens.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full gradient-gold progress-fill progress-w-${Math.round(
                      property.totalTokens > 0
                        ? ((property.totalTokens - property.availableTokens) /
                            property.totalTokens) *
                            100
                        : 0,
                    )}`}
                  />
                </div>

                <Link
                  href={`/properties/${property.id}`}
                  aria-label={`Invest in ${property.title}`}
                >
                  <Button className="w-full gradient-gold text-white hover:opacity-90">
                    Invest Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
