"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { UserCheck, Wallet, Building2, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    step: "01",
    title: "Verify Identity",
    description:
      "Complete KYC in under 5 minutes with our AI-powered verification system.",
    color: "#E2B93B",
  },
  {
    icon: Wallet,
    step: "02",
    title: "Connect Wallet",
    description:
      "Link your Web3 wallet or create one. Support for MetaMask, Coinbase, and more.",
    color: "#3B82F6",
  },
  {
    icon: Building2,
    step: "03",
    title: "Choose Property",
    description:
      "Browse curated properties, analyze AI insights, and select your investment.",
    color: "#10B981",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Earn Returns",
    description:
      "Receive rental yields and appreciation payouts directly to your wallet.",
    color: "#A855F7",
  },
];

function StepCard({ item, index }: { item: (typeof steps)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotateX: 0 }
          : { opacity: 0, y: 50, rotateX: -10 }
      }
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{ perspective: "800px" }}
      className="relative group"
    >
      <div className="relative p-6 sm:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-center overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]">
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${item.color}15, transparent 70%)`,
          }}
        />

        {/* Step number - large background */}
        <div className="absolute top-3 right-4 text-6xl font-black opacity-[0.04] group-hover:opacity-[0.08] transition-opacity select-none">
          {item.step}
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-500 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
              border: `1px solid ${item.color}30`,
              boxShadow: `0 0 0 0 ${item.color}00`,
            }}
            whileHover={{
              boxShadow: `0 8px 32px ${item.color}25`,
            }}
          >
            <item.icon className="w-7 h-7" style={{ color: item.color }} />
          </motion.div>

          {/* Step badge */}
          <div
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
            style={{
              background: `${item.color}10`,
              color: `${item.color}cc`,
              border: `1px solid ${item.color}20`,
            }}
          >
            Step {item.step}
          </div>

          <h3 className="text-lg font-semibold mb-3 text-white/90 group-hover:text-white transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Connector line (desktop only) */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-4 w-8">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
            className="h-px bg-gradient-to-r from-white/20 to-transparent origin-left"
          />
        </div>
      )}
    </motion.div>
  );
}

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineWidth = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "100%"]);

  return (
    <section
      id="how-it-works"
      className="py-24 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(226,185,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(226,185,59,0.3)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#E2B93B] animate-pulse" />
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
              Investment Flow
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            How It{" "}
            <span className="bg-gradient-to-r from-[#E2B93B] via-[#f3c94a] to-[#B89221] bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">
            From signup to first investment in under 10 minutes.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((item, i) => (
            <StepCard key={item.step} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}