"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Building2,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Landmark,
  Activity,
  AlertTriangle,
  Globe,
} from "lucide-react";

const navSections = [
  {
    label: "Command Center",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/users", label: "User Management", icon: Users },
      { href: "/admin/kyc", label: "KYC Review", icon: FileCheck },
      { href: "/admin/assets", label: "Asset Registry", icon: Building2 },
      { href: "/admin/kyc-queue", label: "Verification Queue", icon: Shield },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/admin/moderation", label: "Moderation", icon: Activity },
      { href: "/admin/compliance", label: "Compliance", icon: Landmark },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "Configuration", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [stats, setStats] = useState({ users: "—", properties: "—" });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, propsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/properties"),
        ]);
        const users = await usersRes.json();
        const props = await propsRes.json();
        if (users.success) setStats((s) => ({ ...s, users: users.users.length.toLocaleString() }));
        if (props.success) setStats((s) => ({ ...s, properties: props.properties.length.toString() }));
      } catch {
        // Silently fail
      }
    };
    fetchStats();
  }, []);

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-white/5 bg-[#090A0C]/60 backdrop-blur-sm hidden lg:flex flex-col">
      {/* Quick Stats */}
      <div className="p-4 border-b border-white/5">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Users", value: stats.users, icon: Users, color: "text-blue-400" },
            { label: "Assets", value: stats.properties, icon: Building2, color: "text-emerald-400" },
            { label: "System", value: "Online", icon: Globe, color: "text-[#E2B93B]" },
            { label: "Alerts", value: "0", icon: AlertTriangle, color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-1 mb-1">
                <stat.icon className={cn("w-3 h-3", stat.color)} />
                <span className="text-[9px] text-neutral-500 font-mono uppercase">{stat.label}</span>
              </div>
              <div className="text-sm font-bold text-white font-mono">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-600 px-3 mb-2">
              {section.label}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all",
                      isActive
                        ? "bg-[#E2B93B]/10 text-[#E2B93B] border border-[#E2B93B]/20 shadow-sm shadow-[#E2B93B]/5"
                        : "text-neutral-500 hover:text-white hover:bg-white/5",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-[#E2B93B]" : "text-neutral-600",
                      )}
                    />
                    <span>{item.label}</span>
                    {item.href === "/admin/kyc" && (
                      <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Live
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mb-2">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <div>
            <span className="text-[9px] font-mono font-bold text-emerald-400 block">
              ALL SYSTEMS ONLINE
            </span>
            <span className="text-[8px] font-mono text-neutral-600">
              Polygon &middot; Ethereum
            </span>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all text-left"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}