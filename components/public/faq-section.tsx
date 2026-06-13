"use client";

import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Shield,
  Wallet,
  TrendingUp,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    question: "What is fractional real estate investing?",
    answer:
      "Fractional real estate investing allows you to own a portion of a property rather than the entire asset. Through tokenization, each property is divided into digital tokens that represent ownership shares. You can invest as little as $100 and earn proportional returns from rental income and property appreciation.",
    category: "Getting Started",
  },
  {
    question: "How do I create an account on RealtyX?",
    answer:
      "Creating an account is simple. Click 'Sign Up' on our homepage, provide your email address, create a secure password, and complete the KYC (Know Your Customer) verification process. Once verified, you can browse properties and start investing immediately.",
    category: "Getting Started",
  },
  {
    question: "What is the minimum investment amount?",
    answer:
      "The minimum investment on RealtyX is $100 (or equivalent in NGN). This makes premium real estate accessible to everyone. Each property has different token prices, so the exact minimum may vary depending on the specific investment opportunity.",
    category: "Getting Started",
  },
  {
    question: "Do I need to be a Nigerian citizen to invest?",
    answer:
      "No. RealtyX is open to investors worldwide. While we focus on African real estate markets, particularly Nigeria, anyone with a valid government-issued ID can create an account and invest. We support multiple currencies including NGN and USD.",
    category: "Getting Started",
  },
  // Investing
  {
    question: "How do returns work on RealtyX?",
    answer:
      "Returns come from two sources: rental income (distributed quarterly) and property appreciation (realized upon exit). Expected annual returns range from 14-22% depending on the property. Returns are distributed proportionally based on your token ownership.",
    category: "Investing",
  },
  {
    question: "What are the different property types available?",
    answer:
      "RealtyX offers three main property categories: Premium Residential (luxury apartments and estates), Commercial Office/Retail (office towers and retail spaces), and Infrastructure Hubs (logistics, medical, and industrial facilities). Each category has different risk-return profiles.",
    category: "Investing",
  },
  {
    question: "Can I sell my tokens before the property exits?",
    answer:
      "Yes. RealtyX operates a secondary market where you can list your tokens for sale to other investors. The secondary market provides liquidity, allowing you to exit your position before the property's planned exit date. Transaction fees apply.",
    category: "Investing",
  },
  {
    question: "How are property valuations determined?",
    answer:
      "Property valuations are conducted by independent, certified appraisers and updated quarterly. We use a combination of market comparables, income approach, and replacement cost methods. All valuations are audited and transparently reported to investors.",
    category: "Investing",
  },
  {
    question: "What is the expected investment timeline?",
    answer:
      "Investment timelines vary by property. Completed properties generate immediate rental income with a typical hold period of 3-5 years. Off-plan properties have construction phases of 12-24 months followed by a rental period. Each property listing shows the expected timeline.",
    category: "Investing",
  },
  // Security & Compliance
  {
    question: "How is my investment secured?",
    answer:
      "RealtyX uses institutional-grade security including: blockchain-based tokenization for transparent ownership records, smart contracts audited by leading firms, multi-signature wallets for fund custody, and regulatory compliance with SEC and CBN guidelines. Your assets are protected by multiple layers of security.",
    category: "Security & Compliance",
  },
  {
    question: "What is KYC and why is it required?",
    answer:
      "KYC (Know Your Customer) is a regulatory requirement that verifies your identity. You'll need to provide a government-issued ID, proof of address, and complete a brief verification process. This protects all investors and ensures compliance with anti-money laundering regulations.",
    category: "Security & Compliance",
  },
  {
    question: "Is RealtyX regulated?",
    answer:
      "Yes. RealtyX operates under regulatory frameworks including SEC (Securities and Exchange Commission) guidelines and CBN (Central Bank of Nigeria) compliance. We work with licensed custodians and undergo regular audits to ensure full regulatory compliance.",
    category: "Security & Compliance",
  },
  {
    question: "What happens if a property underperforms?",
    answer:
      "While we carefully vet all properties, real estate investments carry inherent risks. If a property underperforms, our team works to optimize operations and maximize returns. In worst-case scenarios, the property may be sold at a loss, and investors receive proportional proceeds. Diversification across multiple properties helps mitigate risk.",
    category: "Security & Compliance",
  },
  // Account & Payments
  {
    question: "How do I fund my account?",
    answer:
      "You can fund your account via bank transfer (NGN or USD), cryptocurrency (ETH, USDC, USDT), or debit/credit card. All deposits are processed instantly for crypto and within 24 hours for bank transfers. Minimum deposit is $100.",
    category: "Account & Payments",
  },
  {
    question: "How are dividends paid out?",
    answer:
      "Dividends from rental income are distributed quarterly to your RealtyX wallet. You can withdraw to your bank account, reinvest in other properties, or hold in your wallet. Dividend payments are transparently tracked on your dashboard.",
    category: "Account & Payments",
  },
  {
    question: "Can I withdraw my investment at any time?",
    answer:
      "You can sell your tokens on the secondary market at any time. For direct withdrawals, there is a minimum holding period of 30 days. Early withdrawal fees may apply depending on the property's investment terms. Check each property's specific terms for details.",
    category: "Account & Payments",
  },
  {
    question: "What fees does RealtyX charge?",
    answer:
      "RealtyX charges a 2% management fee on rental income and a 1% transaction fee on secondary market trades. There are no fees for deposits, withdrawals, or holding tokens. All fees are transparently disclosed before any transaction.",
    category: "Account & Payments",
  },
];

const categories = [
  "All",
  "Getting Started",
  "Investing",
  "Security & Compliance",
  "Account & Payments",
];

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFAQs = useMemo(() => {
    return faqData.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);
  const categoryIcons: Record<string, ReactNode> = {
    "Getting Started": <HelpCircle className="w-4 h-4" />,
    Investing: <TrendingUp className="w-4 h-4" />,
    "Security & Compliance": <Shield className="w-4 h-4" />,
    "Account & Payments": <Wallet className="w-4 h-4" />,
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 focus:outline-none focus:ring-1 transition-all text-sm"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-[#E2B93B] text-[#090A0C] shadow-md"
                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No questions found</p>
            <p className="text-sm mt-1">
              Try adjusting your search or category filter.
            </p>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/50 bg-card/50 overflow-hidden transition-all hover:border-border"
            >
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-[#E2B93B] shrink-0">
                    {categoryIcons[faq.category] || (
                      <HelpCircle className="w-4 h-4" />
                    )}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {faq.question}
                  </span>
                </div>
                <span className="text-muted-foreground shrink-0 ml-4">
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>
              {expandedIndex === index && (
                <div className="px-5 pb-5 pt-0">
                  <div className="pl-7 text-sm text-muted-foreground leading-relaxed border-l-2 border-[#E2B93B]/20 ml-0.5">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contact CTA */}
      <div className="text-center p-8 rounded-2xl border border-border/50 bg-card/50">
        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our team is here to help. Reach out and we&apos;ll get back to you
          within 24 hours.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-[#090A0C] font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
