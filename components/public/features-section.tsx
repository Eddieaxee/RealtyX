"use client";
import { motion } from "framer-motion";
import { Building2, Wallet, Brain, Shield, Globe, BarChart3 } from "lucide-react";
const features = [
  { icon: Building2, title: "Fractional Ownership", description: "Own premium real estate from just $100. Diversify across properties, cities, and countries." },
  { icon: Wallet, title: "Tokenized Assets", description: "Each property is tokenized on-chain. Trade, transfer, or hold with full transparency." },
  { icon: Brain, title: "AI Intelligence", description: "Our AI copilot analyzes market trends, predicts yields, and optimizes your portfolio." },
  { icon: Shield, title: "Institutional Security", description: "Bank-grade KYC, multi-sig wallets, and audited smart contracts protect every investment." },
  { icon: Globe, title: "Global Access", description: "Invest in properties across 15+ countries. No borders, no minimums, no barriers." },
  { icon: BarChart3, title: "Real-Time Analytics", description: "Track portfolio performance, rental yields, and appreciation with live dashboards." },
];
export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Invest With <span className="text-gradient-gold">RealtyX</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">The most advanced fractional real estate platform, built for modern investors.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}