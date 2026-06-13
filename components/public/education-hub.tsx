"use client";

import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import {
  BookOpen,
  Play,
  FileText,
  ExternalLink,
  Youtube,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Shield,
  Building2,
  Search,
} from "lucide-react";

type Category = "all" | "basics" | "tokenization" | "portfolio" | "security";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: Category;
  type: "video" | "guide" | "document" | "interactive";
  duration?: string;
  url?: string;
  thumbnail?: string;
}

const categories = [
  { id: "all" as Category, label: "All Resources", icon: BookOpen },
  { id: "basics" as Category, label: "Investing Basics", icon: Lightbulb },
  { id: "tokenization" as Category, label: "Tokenization", icon: Building2 },
  {
    id: "portfolio" as Category,
    label: "Portfolio Strategy",
    icon: TrendingUp,
  },
  { id: "security" as Category, label: "Security & Compliance", icon: Shield },
];

const resources: Resource[] = [
  {
    id: "vid-1",
    title: "Fractional Real Estate Investing Explained",
    description:
      "A comprehensive video guide covering the fundamentals of fractional ownership and how it works on blockchain platforms.",
    category: "basics",
    type: "video",
    duration: "12:30",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80",
  },
  {
    id: "vid-2",
    title: "How Tokenization Transforms Real Estate",
    description:
      "Learn how blockchain tokenization creates liquidity, transparency, and accessibility in property markets.",
    category: "tokenization",
    type: "video",
    duration: "15:45",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
  },
  {
    id: "vid-3",
    title: "Building Your First Real Estate Portfolio",
    description:
      "Step-by-step walkthrough of creating a diversified portfolio with as little as $500.",
    category: "portfolio",
    type: "video",
    duration: "18:20",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&q=80",
  },
  {
    id: "guide-1",
    title: "Complete Beginner's Guide to RealtyX",
    description:
      "Everything you need to know to get started: account setup, KYC, funding, and making your first investment.",
    category: "basics",
    type: "guide",
    duration: "25 min read",
    url: "/getting-started",
  },
  {
    id: "guide-2",
    title: "Understanding Property Valuations",
    description:
      "Learn how properties are valued, what metrics to look at, and how to evaluate investment opportunities.",
    category: "basics",
    type: "guide",
    duration: "15 min read",
  },
  {
    id: "guide-3",
    title: "Smart Contracts & Blockchain Security",
    description:
      "A deep dive into how smart contracts protect your investments and ensure transparent ownership records.",
    category: "tokenization",
    type: "guide",
    duration: "20 min read",
  },
  {
    id: "guide-4",
    title: "Diversification Strategies for Small Portfolios",
    description:
      "Smart strategies for spreading risk when you have a limited budget to invest.",
    category: "portfolio",
    type: "guide",
    duration: "12 min read",
  },
  {
    id: "doc-1",
    title: "RealtyX Investment Terms Glossary",
    description:
      "A comprehensive glossary of all terms used in fractional real estate investing.",
    category: "basics",
    type: "document",
    url: "#",
  },
  {
    id: "doc-2",
    title: "Risk Assessment Framework",
    description:
      "Understanding risk categories, return projections, and how to evaluate property risk profiles.",
    category: "portfolio",
    type: "document",
    url: "#",
  },
  {
    id: "doc-3",
    title: "Regulatory Compliance Overview",
    description:
      "SEC, CBN, and international regulatory standards that govern our platform.",
    category: "security",
    type: "document",
    url: "/compliance",
  },
  {
    id: "doc-4",
    title: "Smart Contract Audit Report",
    description:
      "Full audit report from our independent blockchain security auditors.",
    category: "security",
    type: "document",
    url: "#",
  },
  {
    id: "int-1",
    title: "Investment Calculator",
    description:
      "Interactive tool to estimate returns based on investment amount, property type, and holding period.",
    category: "portfolio",
    type: "interactive",
  },
  {
    id: "vid-4",
    title: "Security Best Practices for Crypto Investors",
    description:
      "Essential security practices for protecting your digital assets and investment accounts.",
    category: "security",
    type: "video",
    duration: "10:15",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
  },
];
const typeIcons: Record<
  Resource["type"],
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  video: Play,
  guide: BookOpen,
  document: FileText,
  interactive: ExternalLink,
};

const typeColors = {
  video: "text-red-400 bg-red-400/10",
  guide: "text-blue-400 bg-blue-400/10",
  document: "text-emerald-400 bg-emerald-400/10",
  interactive: "text-purple-400 bg-purple-400/10",
};

export function EducationHub() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = resources.filter((r) => {
    const matchesCategory =
      activeCategory === "all" || r.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 focus:outline-none focus:ring-1 transition-all text-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-[#E2B93B] text-[#090A0C] shadow-md"
                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Video */}
      <div className="relative h-64 md:h-80 bg-neutral-900">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80"
          alt="Featured video"
          fill
          priority
          unoptimized
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
            title="Play featured video"
            aria-label="Play featured video"
            className="w-20 h-20 rounded-full bg-[#E2B93B]/90 flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
          >
            <Play className="w-8 h-8 text-[#090A0C] ml-1" />
          </a>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <span className="text-xs font-bold text-[#E2B93B] uppercase tracking-wider">
            Featured Course
          </span>
          <h3 className="text-xl font-bold mt-1">
            Complete Guide to Fractional Real Estate Investing
          </h3>
          <p className="text-sm text-neutral-300 mt-1">
            12 videos • 2.5 hours • Certificate included
          </p>
        </div>
      </div>

      {/* Resources Grid */}
      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((resource) => {
          const Icon = typeIcons[resource.type];
          return (
            <div
              key={resource.id}
              className="group bg-card rounded-2xl overflow-hidden flex flex-col"
            >
              {resource.thumbnail && (
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={resource.thumbnail}
                    alt={resource.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {resource.type === "video" && resource.duration && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-white">
                      {resource.duration}
                    </span>
                  )}
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${typeColors[resource.type]}`}
                  >
                    <Icon className="w-3 h-3" />
                    {resource.type}
                  </span>
                  {!resource.thumbnail && resource.duration && (
                    <span className="text-[10px] text-muted-foreground">
                      {resource.duration}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold mb-2 group-hover:text-[#E2B93B] transition-colors">
                  {resource.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-3">
                  {resource.description}
                </p>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target={
                      resource.url.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      resource.url.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E2B93B] hover:underline"
                  >
                    {resource.type === "video" ? "Watch Now" : "View Resource"}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    Coming Soon
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No resources found</p>
          <p className="text-sm mt-1">
            Try adjusting your search or category filter.
          </p>
        </div>
      )}

      {/* YouTube Channel CTA */}
      <div className="text-center p-8 rounded-2xl border border-red-500/20 bg-red-500/5">
        <Youtube className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">RealtyX on YouTube</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Subscribe to our YouTube channel for weekly market analysis, property
          tours, and investor education.
        </p>
        <a
          href="https://youtube.com/@realtyx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
        >
          <Youtube className="w-4 h-4" />
          Subscribe on YouTube
        </a>
      </div>
    </div>
  );
}
