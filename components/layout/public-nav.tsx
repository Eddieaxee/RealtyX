"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Building2, ChevronDown, DollarSign, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Inline safety layout function to join dynamic theme names smoothly
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

const navLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/education", label: "Learn" },
  { href: "/trust", label: "Trust" },
];

export function PublicNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [currency, setCurrency] = React.useState<"NGN" | "USD">("NGN");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync state cleanly across global windows without dropping frames
  const handleCurrencyChange = (selected: "NGN" | "USD") => {
    setCurrency(selected);
    setShowCurrencyDropdown(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("realtyx_currency_preference", selected);
      window.dispatchEvent(new Event("realtyx_currency_changed"));
    }
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("realtyx_currency_preference");
      if (saved === "NGN" || saved === "USD") {
        setCurrency(saved);
      }
    }
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-md shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Main Structural Branding */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center shadow-sm shadow-amber-500/20">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight leading-none">
                Realty<span className="text-gradient-gold">X</span>
              </span>
              <span className="text-[9px] text-muted-foreground tracking-wider font-semibold uppercase mt-0.5">
                Institutional Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Link Cluster */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 relative py-1",
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span 
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 rounded-full" 
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Execution Controls & Web3 Core Rails */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Live Dual Currency Switcher Menu Component */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 text-xs font-semibold text-card-foreground hover:bg-accent hover:text-accent-foreground transition-all focus:outline-none"
                aria-label="Toggle currency system"
              >
                {currency === "NGN" ? (
                  <span className="flex items-center gap-1">
                    <span className="w-3.5 h-2.5 bg-[#008751] rounded-sm inline-block opacity-90" />
                    ₦ NGN
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-amber-500" />
                    USD
                  </span>
                )}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showCurrencyDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCurrencyDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-44 rounded-xl bg-popover border border-border shadow-2xl p-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-2 py-1 text-[9px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
                      <Activity className="w-2.5 h-2.5 text-amber-500" />
                      Settlement Engine
                    </div>
                    <button
                      onClick={() => handleCurrencyChange("NGN")}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-colors mt-1",
                        currency === "NGN" ? "bg-amber-500/10 text-amber-500" : "text-popover-foreground hover:bg-accent"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-2.5 bg-[#008751] rounded-sm inline-block" />
                        Nigerian Naira
                      </span>
                      {currency === "NGN" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    </button>
                    <button
                      onClick={() => handleCurrencyChange("USD")}
                      className={cn(
                        "w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-colors",
                        currency === "USD" ? "bg-amber-500/10 text-amber-500" : "text-popover-foreground hover:bg-accent"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-2.5 bg-blue-600 rounded-sm inline-block flex items-center justify-center text-[7px] text-white font-bold">$$</span>
                        US Dollar
                      </span>
                      {currency === "USD" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* RainbowKit Integrated Web3 Wallet Gateway */}
            <ConnectButton
              showBalance={false}
              accountStatus="address"
              chainStatus="icon"
            />
            
            <Link href="/dashboard">
              <Button className="gradient-gold text-white border-0 hover:opacity-90 shadow-sm transition-opacity">
                Launch App
              </Button>
            </Link>
          </div>

          {/* Responsive Mobile Layout Menu Controls */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => handleCurrencyChange(currency === "NGN" ? "USD" : "NGN")}
              className="text-xs font-bold bg-secondary border border-border text-secondary-foreground px-2.5 py-1.5 rounded-lg active:scale-95 transition-transform"
            >
              {currency === "NGN" ? "₦" : "$"}
            </button>
            <button
              className="p-2 text-muted-foreground hover:text-foreground focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle structural layout menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-4 py-6 space-y-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block text-lg font-medium py-2 px-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors",
                      pathname === link.href ? "text-amber-500 bg-amber-500/5 font-semibold" : "text-muted-foreground"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <div className="pt-4 border-t border-border/60 space-y-3">
                <div className="flex justify-start transform-gpu">
                  <ConnectButton showBalance={false} />
                </div>
                <Link href="/dashboard" className="block" onClick={() => setIsOpen(false)}>
                  <Button className="w-full gradient-gold text-white border-0 py-5">
                    Launch App
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}