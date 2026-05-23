"use client";
import { motion } from "framer-motion";
import { UserCheck, Wallet, Building2, TrendingUp } from "lucide-react";
const steps = [
  { icon: UserCheck, step: "01", title: "Verify Identity", description: "Complete KYC in under 5 minutes with our AI-powered verification system." },
  { icon: Wallet, step: "02", title: "Connect Wallet", description: "Link your Web3 wallet or create one. Support for MetaMask, Coinbase, and more." },
  { icon: Building2, step: "03", title: "Choose Property", description: "Browse curated properties, analyze AI insights, and select your investment." },
  { icon: TrendingUp, step: "04", title: "Earn Returns", description: "Receive rental yields and appreciation payouts directly to your wallet." },
];
export function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It <span className="text-gradient-gold">Works</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">From signup to first investment in under 10 minutes.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative">
              <div className="p-6 rounded-2xl border border-border/50 bg-card/50 text-center">
                <div className="text-5xl font-bold text-gradient-gold opacity-20 absolute top-4 right-4">{item.step}</div>
                <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mx-auto mb-4"><item.icon className="w-7 h-7 text-white" /></div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              {i < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-gold-500 to-transparent" />}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}