"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";
import { ParticleField } from "@/components/three/particle-field";
import { useCurrency } from "@/context/currency-context";

export function HeroSection() {
  const { formatValue } = useCurrency();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Particle field */}
      <div className="absolute inset-0 opacity-40">
        <ParticleField />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
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
                  className="text-lg px-8 py-6"
                >
                  Explore Properties
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold-400" />
                <span className="text-sm font-medium">14-22% Avg Return</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold-400" />
                <span className="text-sm font-medium">SEC & CBN Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-400" />
                <span className="text-sm font-medium">5K+ Investors</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold-500/20 to-primary/20 rounded-3xl blur-2xl" />
              <div className="relative glass rounded-3xl p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Portfolio Value
                  </span>
                  <span className="text-sm font-medium text-green-500">
                    +18.4%
                  </span>
                </div>
                <div className="text-4xl font-bold">{formatValue(142850)}</div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Properties", value: "6" },
                    { label: "Tokens", value: "8.4K" },
                    { label: "Yield", value: "12.5%" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-3 rounded-xl bg-white/5"
                    >
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {[
                    {
                      name: "Ikoyi Luxury Penthouse",
                      value: 45000,
                      color: "bg-gold-500",
                    },
                    {
                      name: "VI Commercial Tower",
                      value: 32000,
                      color: "bg-blue-500",
                    },
                    {
                      name: "Lekki Phase 1 Estate",
                      value: 28000,
                      color: "bg-purple-500",
                    },
                  ].map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="text-muted-foreground">
                          {formatValue(item.value)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(item.value / 45000) * 100}%`,
                          }}
                          transition={{ duration: 1, delay: 0.8 }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
