"use client";

import { useState, useMemo } from "react";
import { Search, Clock, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  readTime: string;
  date: string;
  featured: boolean;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: "fractional-investing-101",
    title: "Fractional Real Estate Investing: The Complete Guide for 2026",
    excerpt:
      "Learn how fractional ownership is revolutionizing real estate investment, making premium properties accessible from just $100.",
    category: "Investment",
    tags: ["Beginner", "Guide", "Real Estate"],
    readTime: "8 min read",
    date: "2026-06-01",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
  },
  {
    id: "blockchain-tokenization",
    title: "How Blockchain Tokenization is Transforming African Real Estate",
    excerpt:
      "Explore how tokenization creates transparency, liquidity, and accessibility in the African property market.",
    category: "Technology",
    tags: ["Blockchain", "Tokenization", "Africa"],
    readTime: "6 min read",
    date: "2026-05-25",
    featured: true,
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
  },
  {
    id: "lagos-market-outlook",
    title: "Lagos Real Estate Market Outlook: Q2 2026 Analysis",
    excerpt:
      "A deep dive into the current state and future projections of Lagos premium real estate market segments.",
    category: "Market Analysis",
    tags: ["Lagos", "Market", "Analysis"],
    readTime: "10 min read",
    date: "2026-05-18",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    id: "portfolio-diversification",
    title: "Building a Diversified Real Estate Portfolio with Tokenized Assets",
    excerpt:
      "Strategies for spreading risk across property types, locations, and lifecycle stages using fractional tokens.",
    category: "Investment",
    tags: ["Strategy", "Portfolio", "Diversification"],
    readTime: "7 min read",
    date: "2026-05-10",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
  },
  {
    id: "reits-vs-tokenization",
    title:
      "REITs vs Tokenized Real Estate: Which is Better for African Investors?",
    excerpt:
      "Compare traditional REITs with modern tokenized real estate platforms to find the best investment approach.",
    category: "Investment",
    tags: ["REITs", "Comparison", "Guide"],
    readTime: "9 min read",
    date: "2026-05-02",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  },
  {
    id: "smart-contracts-security",
    title:
      "Smart Contract Security in Real Estate: What Investors Need to Know",
    excerpt:
      "Understanding how audited smart contracts protect your real estate investment on the blockchain.",
    category: "Technology",
    tags: ["Security", "Smart Contracts", "DeFi"],
    readTime: "6 min read",
    date: "2026-04-28",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
  },
  {
    id: "diversification-strategy",
    title: "Building a Diversified Real Estate Portfolio with $500",
    excerpt:
      "How to strategically allocate a small investment across multiple properties to maximize returns and minimize risk.",
    category: "Investment",
    tags: ["Strategy", "Beginner", "Portfolio"],
    readTime: "5 min read",
    date: "2026-04-20",
    featured: false,
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
  },
];

const categories = ["All", "Investment", "Technology", "Market Analysis"];

export function BlogGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const featuredPosts = filteredPosts.filter((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured);

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 focus:outline-none focus:ring-1 transition-all text-sm"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-[#E2B93B] text-[#090A0C] shadow-md"
                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E2B93B]" /> Featured Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="group rounded-2xl border border-border/50 bg-card/50 overflow-hidden hover:border-[#E2B93B]/20 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#E2B93B]/90 text-[10px] font-bold uppercase tracking-wider text-[#090A0C]">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-[#E2B93B] bg-[#E2B93B]/10 px-2.5 py-0.5 rounded-md">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-[#E2B93B] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {post.tags.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-[#E2B93B] transition-colors" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {regularPosts.map((post) => (
          <article
            key={post.id}
            className="group rounded-2xl border border-border/50 bg-card/50 overflow-hidden hover:border-[#E2B93B]/20 transition-all flex flex-col"
          >
            <div className="relative h-40 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-medium text-[#E2B93B] bg-[#E2B93B]/10 px-2 py-0.5 rounded">
                  {post.category}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {post.readTime}
                </span>
              </div>
              <h3 className="text-sm font-bold mb-2 group-hover:text-[#E2B93B] transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
                {post.excerpt}
              </p>
              <div className="flex gap-1.5">
                {post.tags.slice(0, 2).map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No articles found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
}
