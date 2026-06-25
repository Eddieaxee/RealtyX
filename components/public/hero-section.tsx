"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  TrendingUp,
  Users,
  MapPin,
  Building2,
} from "lucide-react";
import propertiesData from "@/data/properties.json";
import dynamic from "next/dynamic";
import React from "react";

// Fixes the 3 Type/Import errors by using your project absolute alias path
const Tesseract = dynamic<{ className?: string }>(
  () => import("@/components/three/tesseract").then((mod) => mod.Tesseract),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-transparent" />,
  },
);

const FEATURED_PROPERTIES = (
  propertiesData as Array<{
    id: string;
    title: string;
    location: string;
    lifecycle: string;
    tokenPriceUSD: number;
    totalTokens: number;
    availableTokens: number;
    expectedReturn: number;
  }>
).slice(0, 3);

const formatValue = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#030712]">
      {/* 3D Tesseract Background */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Tesseract />
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#030712]/90 via-[#030712]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#030712]/80 pointer-events-none" />

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Now Live on Polygon & Ethereum
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white mb-6">
              Own Real Estate{" "}
              <span className="text-gradient-gold">Fractionally</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Invest in premium tokenized properties across Nigeria from as low
              as $100. AI-powered insights, institutional security, and seamless
              blockchain ownership.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="gradient-gold text-white text-lg px-8 py-6 hover:opacity-90 group"
                >
                  Start Investing
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/properties">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 text-white border-white/20 hover:bg-white/10"
                >
                  Explore Properties
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#E2B93B]" />
                <span className="text-sm font-medium">14-22% Avg Return</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#E2B93B]" />
                <span className="text-sm font-medium">SEC & CBN Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#E2B93B]" />
                <span className="text-sm font-medium">5K+ Investors</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Glass Tracker Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#E2B93B]/15 via-transparent to-blue-500/10 rounded-3xl blur-xl opacity-60" />

              <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl border border-white/[0.08] bg-white/[0.03]">
                <div className="relative p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#E2B93B]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Featured Assets
                      </span>
                    </div>
                    <Link
                      href="/properties"
                      className="text-[10px] text-[#E2B93B] hover:underline font-medium"
                    >
                      View All →
                    </Link>
                  </div>

                  {FEATURED_PROPERTIES.map((prop) => {
                    const fundedPercent =
                      prop.totalTokens > 0
                        ? Math.round(
                            ((prop.totalTokens - prop.availableTokens) /
                              prop.totalTokens) *
                              100,
                          )
                        : 0;
                    const progressClass = `funded-progress-${prop.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
                    return (
                      <Link
                        key={prop.id}
                        href={`/invest/${prop.id}`}
                        className="block p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#E2B93B]/20 hover:bg-white/[0.05] transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-bold text-white">
                              {prop.title}
                            </h4>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-neutral-500" />
                              <span className="text-[10px] text-neutral-400">
                                {prop.location}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              prop.lifecycle === "COMPLETED"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {prop.lifecycle === "COMPLETED"
                              ? "Active"
                              : "Construction"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="text-[9px] text-neutral-500 uppercase">
                                Token Price
                              </div>
                              <div className="text-xs font-bold text-[#E2B93B] font-mono">
                                {formatValue(prop.tokenPriceUSD)}
                              </div>
                            </div>
                            <div>
                              <div className="text-[9px] text-neutral-500 uppercase">
                                Projected IRR
                              </div>
                              <div className="text-xs font-bold text-emerald-400 font-mono">
                                {prop.expectedReturn}%
                              </div>
                            </div>
                          </div>

                          <div className="w-16">
                            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r from-[#E2B93B] to-amber-500 rounded-full ${progressClass}`}
                              />
                            </div>
                            <div className="text-[8px] text-neutral-500 text-right mt-0.5 font-mono">
                              {fundedPercent}%
                            </div>
                          </div>
                        </div>

                        <style jsx>{`
                          .${progressClass} {
                            width: ${fundedPercent}%;
                          }
                        `}</style>
                      </Link>
                    );
                  })}

                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500">
                      Total Tokenized Volume
                    </span>
                    <span className="text-xs font-bold text-[#E2B93B] font-mono">
                      {(() => {
                        const totalUSD = (
                          propertiesData as Array<{
                            totalTokens: number;
                            tokenPriceUSD: number;
                          }>
                        ).reduce(
                          (sum, p) =>
                            sum + (p.totalTokens || 0) * (p.tokenPriceUSD || 0),
                          0,
                        );
                        return formatValue(totalUSD);
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
