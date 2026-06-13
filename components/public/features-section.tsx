"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
import {
  Building2,
  Wallet,
  Brain,
  Shield,
  Globe,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Fractional Ownership",
    description:
      "Own premium real estate from just $100. Diversify across properties, cities, and countries with tokenized shares.",
    stat: "$100",
    statLabel: "Minimum Entry",
    gradient: "from-amber-500/20 to-orange-600/20",
    // use Tailwind text color utility instead of inline color
    accentClass: "text-amber-400",
  },
  {
    icon: Wallet,
    title: "Tokenized Assets",
    description:
      "Each property is tokenized on-chain. Trade, transfer, or hold with full transparency and immutable records.",
    stat: "100%",
    statLabel: "On-Chain",
    gradient: "from-blue-500/20 to-cyan-600/20",
    accentClass: "text-blue-500",
  },
  {
    icon: Brain,
    title: "AI Intelligence",
    description:
      "Our AI copilot analyzes market trends, predicts yields, and optimizes your portfolio allocation strategy.",
    stat: "24/7",
    statLabel: "AI Monitoring",
    gradient: "from-purple-500/20 to-pink-600/20",
    accentClass: "text-purple-500",
  },
  {
    icon: Shield,
    title: "Institutional Security",
    description:
      "Bank-grade KYC, multi-sig wallets, and audited smart contracts protect every investment you make.",
    stat: "SOC 2",
    statLabel: "Compliant",
    gradient: "from-emerald-500/20 to-green-600/20",
    accentClass: "text-emerald-500",
  },
  {
    icon: Globe,
    title: "Global Access",
    description:
      "Invest in properties across 15+ countries. No borders, no minimums, no barriers to entry.",
    stat: "15+",
    statLabel: "Countries",
    gradient: "from-cyan-500/20 to-blue-600/20",
    accentClass: "text-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track portfolio performance, rental yields, and appreciation with live dashboards and instant notifications.",
    stat: "18.4%",
    statLabel: "Avg Return",
    gradient: "from-rose-500/20 to-red-600/20",
    accentClass: "text-rose-500",
  },
];

/**
 * Stacking Cards Component - Cards stack on top of each other with parallax/scale effect
 * as the user scrolls. Each card uses a sticky position to create the stacking illusion.
 */
function StackingCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  useInView(cardRef, { once: false, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // positional and scale transforms driven by scroll progress
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -40]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.92, 1, 1, 0.98],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.6, 1, 0.8]);

  // smooth the y motion for nicer parallax
  const smoothY = useSpring(y, { stiffness: 200, damping: 30 });

  // map index to Tailwind z-index classes to avoid inline styles
  const zClasses = ["z-50", "z-40", "z-30", "z-20", "z-10", "z-0"];
  const zClass = zClasses[index] ?? "z-0";

  return (
    <motion.div
      ref={cardRef}
      style={{ y: smoothY, scale, opacity }}
      className="relative group"
    >
      <div
        className={`relative p-6 sm:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04] ${zClass}`}
      >
        {/* Gradient glow on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl`}
        />

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
        >
          <feature.icon
            className={`w-6 h-6 transition-colors duration-300 ${feature.accentClass}`}
          />
        </div>

        <motion.div
          className="flex items-center gap-1 text-xs font-medium text-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ x: 3 }}
        >
          Learn more <ArrowUpRight className="w-3 h-3" />
        </motion.div>
      </div>

      <h3 className="text-xl font-semibold mb-3 text-white/90 group-hover:text-white transition-colors">
        {feature.title}
      </h3>

      <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors mb-6">
        {feature.description}
      </p>

      {/* Stat badge */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
        <span
          className={`text-2xl font-bold transition-colors duration-300 ${feature.accentClass}`}
        >
          {feature.stat}
        </span>
        <span className="text-xs text-white/30 uppercase tracking-wider">
          {feature.statLabel}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Rolling In Animation Wrapper - Elements animate in from below when entering viewport
 */
function RollingIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: -15, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, rotateX: 0, scale: 1 }
          : { opacity: 0, y: 60, rotateX: -15, scale: 0.95 }
      }
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section className="py-24 relative overflow-hidden" ref={sectionRef}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#E2B93B_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with rolling animation */}
        <RollingIn>
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#E2B93B] animate-pulse" />
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Platform Features
              </span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Why Invest With{" "}
              <span className="bg-gradient-to-r from-[#E2B93B] via-[#f3c94a] to-[#B89221] bg-clip-text text-transparent">
                RealtyX
              </span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
              The most advanced fractional real estate platform, built for
              modern investors who demand institutional-grade infrastructure.
            </p>
          </div>
        </RollingIn>

        {/* Stacking Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <StackingCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        {/* Bottom stat bar with rolling animation */}
        <RollingIn delay={0.3}>
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "$2.4B+", label: "Assets Tokenized" },
              { value: "50K+", label: "Active Investors" },
              { value: "15+", label: "Countries" },
              { value: "18.4%", label: "Avg Annual Return" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
                whileHover={{
                  scale: 1.03,
                  borderColor: "rgba(226, 185, 59, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#E2B93B] to-[#B89221] bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </RollingIn>
      </div>
    </section>
  );
}
