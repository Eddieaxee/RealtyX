"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield,
  Lock,
  FileCheck,
  Eye,
  Server,
  Fingerprint,
} from "lucide-react";
import styles from "./trust-section.module.css";

const trustItems = [
  {
    icon: Shield,
    title: "SOC 2 Type II Certified",
    description:
      "Annual third-party audits of our security controls and infrastructure.",
    color: "#E2B93B",
  },
  {
    icon: Lock,
    title: "256-bit Encryption",
    description:
      "All data encrypted at rest and in transit with AES-256 standards.",
    color: "#3B82F6",
  },
  {
    icon: FileCheck,
    title: "Smart Contract Audits",
    description:
      "Contracts audited by CertiK, OpenZeppelin, and Trail of Bits.",
    color: "#10B981",
  },
  {
    icon: Eye,
    title: "Real-Time Monitoring",
    description:
      "24/7 fraud detection and anomaly monitoring across all transactions.",
    color: "#A855F7",
  },
  {
    icon: Server,
    title: "Multi-Sig Custody",
    description:
      "Institutional-grade multi-signature wallets for asset custody.",
    color: "#06B6D4",
  },
  {
    icon: Fingerprint,
    title: "Biometric KYC",
    description:
      "AI-powered identity verification with liveness detection.",
    color: "#F43F5E",
  },
];

function TrustCard({ item, index }: { item: (typeof trustItems)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.95 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group"
      style={{
        "--item-color": item.color,
        "--item-color-10": `${item.color}10`,
        "--item-color-15": `${item.color}15`,
        "--item-color-08": `${item.color}08`,
        "--item-color-25": `${item.color}25`,
      } as React.CSSProperties}
    >
      <motion.div
        className="relative flex items-start gap-4 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Hover glow */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${styles.hoverGlow}`}
        />

        <div className="relative z-10 shrink-0">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${styles.iconWrapper}`}
          >
            <item.icon className={`w-5 h-5 ${styles.iconColor}`} />
          </div>
        </div>

        <div className="relative z-10">
          <h3 className="font-semibold text-white/90 group-hover:text-white transition-colors mb-1">
            {item.title}
          </h3>
          <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
            {item.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TrustSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section
      className="py-24 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E2B93B]/[0.02] to-transparent" />

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#E2B93B_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] mb-6">
            <Shield className="w-4 h-4 text-[#E2B93B]/60" />
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
              Security & Compliance
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Built on{" "}
            <span className="bg-gradient-to-r from-[#E2B93B] via-[#f3c94a] to-[#B89221] bg-clip-text text-transparent">
              Trust
            </span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-lg">
            Institutional-grade security and compliance at every layer.
          </p>
        </motion.div>

        {/* Trust cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trustItems.map((item, i) => (
            <TrustCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* Bottom certification bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-6 sm:gap-10 pt-8 border-t border-white/[0.06]"
        >
          {["CertiK Audited", "OpenZeppelin Verified", "SOC 2 Certified", "PCI DSS Compliant"].map(
            (cert) => (
              <div
                key={cert}
                className="flex items-center gap-2 text-white/20 hover:text-white/40 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#E2B93B]/40" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  {cert}
                </span>
              </div>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}