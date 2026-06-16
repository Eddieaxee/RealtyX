"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, TrendingUp, Shield } from "lucide-react";

/**
 * Premium Glassmorphism CTA Section
 * Replaces the old 'Yellow Card' with a modern glass container featuring:
 * - Soft radial gradient background
 * - Bold high-contrast CTA button
 * - Subtle glow effects using box-shadow and backdrop-filter
 * - Fully responsive and centered on mobile
 */
export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -30]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -4]);

  return (
    <section className="py-24 relative overflow-hidden" ref={sectionRef}>
      {/* Ambient background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#E2B93B]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-purple-500/[0.02] rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ y, rotateX, perspective: 1200 }}
          className="relative"
        >
          {/* Outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#E2B93B]/20 via-blue-500/10 to-[#E2B93B]/20 rounded-[2rem] blur-xl opacity-50" />

          {/* Main Glassmorphism Container */}
          <div className="relative rounded-[2rem] overflow-hidden">
            {/* Glass background layers */}
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.02]" />
            <div className="absolute inset-0 border border-white/[0.08] rounded-[2rem]" />

            {/* Radial gradient accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E2B93B]/[0.06] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/[0.04] rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-12 lg:p-16">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex justify-center mb-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E2B93B]/20 bg-[#E2B93B]/[0.05] backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-[#E2B93B]" />
                  <span className="text-sm font-medium text-[#E2B93B]/80">
                    Join 50,000+ Investors Worldwide
                  </span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-6xl font-bold text-center mb-6 leading-tight"
              >
                <span className="text-white/90">Start Building Your</span>
                <br />
                <span className="bg-gradient-to-r from-[#E2B93B] via-[#f3c94a] to-[#B89221] bg-clip-text text-transparent">
                  Real Estate Empire
                </span>
                <br />
                <span className="text-white/90">Today</span>
              </motion.h2>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-center text-white/40 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
              >
                Get AI-powered insights, institutional security, and access to
                premium properties worldwide. Your portfolio starts here.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="relative group bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#f3c94a] hover:to-[#cbab3a] text-[#090A0C] font-bold text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-[#E2B93B]/20 hover:shadow-[#E2B93B]/30 transition-all duration-300 w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    {/* Glow effect behind button */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E2B93B] to-[#B89221] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                  </Button>
                </Link>
                <Link href="/properties">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/10 text-white/70 hover:text-white hover:bg-white/[0.05] hover:border-white/20 text-lg px-10 py-7 rounded-2xl backdrop-blur-sm transition-all duration-300 w-full sm:w-auto"
                  >
                    Explore Properties
                  </Button>
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6 sm:gap-10 pt-8 border-t border-white/[0.06]"
              >
                {[
                  { icon: Shield, label: "SEC & CBN Regulated" },
                  { icon: Zap, label: "Instant Settlements" },
                  { icon: TrendingUp, label: "18.4% Avg Returns" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-white/30"
                  >
                    <item.icon className="w-4 h-4 text-[#E2B93B]/60" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}