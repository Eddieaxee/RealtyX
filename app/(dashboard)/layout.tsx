"use client";

import React from "react";
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
} from "lucide-react";

// Complete sidebar navigation mapping for all dashboard sections
const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/properties", icon: Building2 },
  { name: "Invest", href: "/dashboard/invest", icon: CreditCard },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: TrendingUp },
  { name: "Earnings", href: "/dashboard/earnings", icon: DollarSign },
  { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  { name: "Capital Calls", href: "/dashboard/capital-calls", icon: Landmark },
  {
    name: "Secondary Market",
    href: "/dashboard/secondary",
    icon: ArrowLeftRight,
  },
  {
    name: "Property Management",
    href: "/dashboard/property-management",
    icon: Building2,
  },
  { name: "KYC Verification", href: "/dashboard/kyc", icon: ShieldCheck },
  { name: "AI Assistant", href: "/dashboard/ai-assistant", icon: Brain },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Sliders },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#090A0C] text-white flex">
      {/* Persistent Left Sidebar Workspace Container */}
      <aside className="w-64 border-r border-white/5 bg-[#0D0E12] p-4 hidden md:flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Platform Branding Header */}
          <Link href="/" className="flex items-center gap-2 px-2 py-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center text-black font-black text-xs">
              RX
            </div>
            <span className="font-sans font-bold tracking-tight text-sm">
              RealtyX
            </span>
          </Link>

          {/* Navigation Link Matrix */}
          <nav className="space-y-0.5">
            {sidebarLinks.map((link) => {
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
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-3">
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
      <main className="flex-1 overflow-y-auto bg-[#090A0C]">{children}</main>
    </div>
  );
}
