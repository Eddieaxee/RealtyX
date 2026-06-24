"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Building2,
  Users,
  FileText,
  Settings,
  LayoutDashboard,
  ChevronRight,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/assets", label: "Assets", icon: Building2 },
  { href: "/admin/kyc", label: "KYC Review", icon: Users, badge: "pending" },
  { href: "/admin/transactions", label: "Transactions", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#030712] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#0D0E12] border-r border-white/5 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
            {sidebarOpen && (
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-black" />
                </div>
                <span className="font-bold text-white">RealtyX</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-white/5 text-neutral-400 hover:text-white"
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    active
                      ? "bg-[#E2B93B]/10 text-[#E2B93B] border border-[#E2B93B]/20"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {item.badge === "pending" && sidebarOpen && (
                    <Badge className="ml-auto bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                      New
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-3 border-t border-white/5">
            {sidebarOpen ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-[#E2B93B]/10 flex items-center justify-center text-[#E2B93B] font-bold text-xs">
                    {session?.user?.name?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {session?.user?.name || "Admin"}
                    </div>
                    <div className="text-xs text-neutral-500 truncate">
                      {session?.user?.email}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-neutral-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                variant="ghost"
                className="w-full justify-center text-neutral-400 hover:text-white"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {/* Top Bar */}
        <header className="h-16 bg-[#0D0E12]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-500">
              Admin Console
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <Input
                placeholder="Search..."
                className="pl-9 h-9 w-64 bg-white/5 border-white/5 text-sm"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-neutral-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E2B93B] rounded-full" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}