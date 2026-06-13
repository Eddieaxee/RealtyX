"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Sliders,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  Brain,
  Bell,
  CreditCard,
  Landmark,
  LogOut,
  DollarSign,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

// Grouped sidebar navigation for the investor workspace
const navSections = [
  {
    label: "Portfolio",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Properties", href: "/properties", icon: Building2 },
      { name: "Invest", href: "/dashboard/invest", icon: CreditCard },
      { name: "Portfolio", href: "/dashboard/portfolio", icon: TrendingUp },
      { name: "Earnings", href: "/dashboard/earnings", icon: DollarSign },
    ],
  },
  {
    label: "Trading",
    items: [
      { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
      { name: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
      { name: "Capital Calls", href: "/dashboard/capital-calls", icon: Landmark },
      { name: "Secondary Market", href: "/dashboard/secondary", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Management",
    items: [
      { name: "Property Management", href: "/dashboard/property-management", icon: Building2 },
      { name: "KYC Verification", href: "/dashboard/kyc", icon: ShieldCheck },
      { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: Brain },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { name: "Settings", href: "/dashboard/settings", icon: Sliders },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090A0C] text-white flex selection:bg-[#E2B93B]/30 selection:text-[#E2B93B]">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/5 bg-[#090A0C]/80 backdrop-blur-xl flex items-center justify-between px-4 md:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-white/5">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center text-black font-black text-[8px]">
            RX
          </div>
          <span className="font-bold text-sm">RealtyX</span>
        </Link>
        <Link href="/dashboard/notifications" className="p-2 rounded-xl hover:bg-white/5 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </Link>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0D0E12] border-r border-white/5 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center text-black font-black text-xs">
                  RX
                </div>
                <span className="font-bold text-sm">RealtyX</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <MobileNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0D0E12] p-4 hidden md:flex flex-col justify-between shrink-0 sticky top-0 h-screen">
        <div className="space-y-6 overflow-y-auto">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 px-2 py-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center text-black font-black text-xs">
              RX
            </div>
            <span className="font-bold tracking-tight text-sm">RealtyX</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="space-y-4">
            {navSections.map((section) => (
              <div key={section.label}>
                <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-600 px-3 mb-1.5">
                  {section.label}
                </h4>
                <div className="space-y-0.5">
                  {section.items.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                      pathname === link.href ||
                      (link.href !== "/dashboard" && pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-3 h-9 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? "bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B]"
                            : "text-neutral-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/[0.02] transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="p-3 bg-[#090A0C] border border-white/5 rounded-xl flex items-center gap-2 text-[10px] font-mono text-neutral-500">
            <Landmark className="w-3.5 h-3.5 text-[#E2B93B]" />
            <span>CBN / SEC Sandbox Active</span>
          </div>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 overflow-y-auto bg-[#090A0C] pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}

/** Mobile navigation component */
function MobileNav({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <nav className="space-y-4">
      {navSections.map((section) => (
        <div key={section.label}>
          <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-600 px-3 mb-1.5">
            {section.label}
          </h4>
          <div className="space-y-0.5">
            {section.items.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 h-9 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#E2B93B]/10 border border-[#E2B93B]/20 text-[#E2B93B]"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}