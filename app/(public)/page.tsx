"use client";

import React from "react";
import { PublicNav } from "@/components/layout/public-nav";
import { HeroSection } from "@/components/public/hero-section";
import { FeaturesSection } from "@/components/public/features-section";
import { PropertiesPreview } from "@/components/public/properties-preview";
import { HowItWorks } from "@/components/public/how-it-works";
import { TrustSection } from "@/components/public/trust-section";
import { CTASection } from "@/components/public/cta-section";
import { Footer } from "@/components/layout/footer";

/**
 * RealtyX Global Portal Entry Page
 * Refactored to act as an immersive, highly structural gateway for fractional 
 * institutional real estate asset backing across African and global markets.
 */
export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-[#E2B93B]/30 selection:text-[#E2B93B] overflow-x-hidden antialiased noise-overlay">
      {/* Ambient background institutional gradient layers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#E2B93B]/[0.04] via-transparent to-transparent pointer-events-none blur-3xl z-0" />
      <div className="absolute top-[1200px] right-0 w-96 h-96 bg-blue-500/[0.03] pointer-events-none blur-3xl z-0" />
      <div className="absolute top-[2400px] left-0 w-[500px] h-[500px] bg-purple-500/[0.02] pointer-events-none blur-3xl z-0" />
      
      {/* Sticky Global Navigation with real routes & currency preference contextual hooks */}
      <PublicNav />
      
      <main className="relative z-10 space-y-0">
        {/* Cinematic WebGL Interactive Canvas & Value Proposition */}
        <HeroSection />
        
        {/* Infrastructure Layer Analysis: Asset Security, Tokenization Mechanics */}
        <FeaturesSection />
        
        {/* Dynamic Live Marketplace Preview: Yielding vs Under Development Structures */}
        <PropertiesPreview />
        
        {/* Operational Capital Flows Sequence Diagram & Investor Lifecycle */}
        <HowItWorks />
        
        {/* Legal, Escrow, Custody & BVN/NIN-Compliant Trust Architecture Verification */}
        <TrustSection />
        
        {/* High-Impact Transaction Entry: Dual Rail Gateway Access point */}
        <CTASection />
      </main>
      
      {/* Fully Functional Corporate Directory Footer */}
      <Footer />
    </div>
  );
}