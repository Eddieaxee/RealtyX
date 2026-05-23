"use client";
import { motion } from "framer-motion";
import { Shield, Lock, FileCheck, Eye, Server, Fingerprint } from "lucide-react";
const trustItems = [
  { icon: Shield, title: "SOC 2 Type II Certified", description: "Annual third-party audits of our security controls and infrastructure." },
  { icon: Lock, title: "256-bit Encryption", description: "All data encrypted at rest and in transit with AES-256 standards." },
  { icon: FileCheck, title: "Smart Contract Audits", description: "Contracts audited by CertiK, OpenZeppelin, and Trail of Bits." },
  { icon: Eye, title: "Real-Time Monitoring", description: "24/7 fraud detection and anomaly monitoring across all transactions." },
  { icon: Server, title: "Multi-Sig Custody", description: "Institutional-grade multi-signature wallets for asset custody." },
  { icon: Fingerprint, title: "Biometric KYC", description: "AI-powered identity verification with liveness detection." },
];
export function TrustSection() {
  return (
    <section className="py-24 relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built on <span className="text-gradient-gold">Trust</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Institutional-grade security and compliance at every layer.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustItems.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-5 rounded-xl border border-border/30 bg-card/30">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><item.icon className="w-5 h-5 text-primary" /></div>
              <div><h3 className="font-semibold mb-1">{item.title}</h3><p className="text-sm text-muted-foreground">{item.description}</p></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}