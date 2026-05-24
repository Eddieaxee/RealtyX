"use client";

import { motion } from "framer-motion";
import { PublicNav } from "@/components/layout/public-nav";
import { HeroSection } from "@/components/public/hero-section";
import { FeaturesSection } from "@/components/public/features-section";
import { PropertiesPreview } from "@/components/public/properties-preview";
import { HowItWorks } from "@/components/public/how-it-works";
import { TrustSection } from "@/components/public/trust-section";
import { CTASection } from "@/components/public/cta-section";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PropertiesPreview />
        <HowItWorks />
        <TrustSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
