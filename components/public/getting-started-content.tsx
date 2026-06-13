"use client";

import { UserPlus, Shield, Search, Wallet, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Account",
    description: "Sign up with your email address and create a secure password. Complete the basic profile setup to get started.",
    details: ["Enter your email and create a password", "Verify your email address", "Complete your basic profile"],
  },
  {
    icon: Shield,
    step: "02",
    title: "Complete KYC Verification",
    description: "Upload your government-issued ID and proof of address. Our verification process is quick and secure.",
    details: ["Upload a valid government-issued ID", "Provide proof of address", "Wait for verification (usually 24 hours)"],
  },
  {
    icon: Wallet,
    step: "03",
    title: "Fund Your Account",
    description: "Deposit funds via bank transfer, cryptocurrency, or debit/credit card. Minimum deposit is $100.",
    details: ["Choose your preferred payment method", "Deposit a minimum of $100", "Funds are available instantly for crypto"],
  },
  {
    icon: Search,
    step: "04",
    title: "Browse Properties",
    description: "Explore our curated selection of premium tokenized properties. Use filters to find the perfect investment.",
    details: ["Browse by property type, location, or yield", "Review property details and projections", "Compare multiple properties side by side"],
  },
  {
    icon: TrendingUp,
    step: "05",
    title: "Invest & Earn",
    description: "Purchase tokens in your chosen properties and start earning returns from rental income and appreciation.",
    details: ["Select the number of tokens to purchase", "Confirm your investment", "Track returns on your dashboard"],
  },
];

export function GettingStartedContent() {
  return (
    <div className="space-y-12">
      {steps.map((step, index) => (
        <div key={step.step} className="relative">
          {index < steps.length - 1 && (
            <div className="absolute left-6 top-16 bottom-0 w-px bg-border/50 hidden md:block" />
          )}
          <div className="flex gap-6 items-start">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-[#E2B93B]/10 border border-[#E2B93B]/20 flex items-center justify-center">
              <step.icon className="w-5 h-5 text-[#E2B93B]" />
            </div>
            <div className="flex-1 p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono font-bold text-[#E2B93B]">Step {step.step}</span>
                <h3 className="text-xl font-bold">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              <ul className="space-y-2">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E2B93B] shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50">
        <h3 className="text-2xl font-bold mb-3">Ready to Start Investing?</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          Join thousands of investors who are building their real estate portfolio with RealtyX.
        </p>
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-[#090A0C] font-semibold hover:opacity-90 transition-opacity"
        >
          Create Account <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}