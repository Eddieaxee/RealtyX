"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PieChart,
  Building2,
  Wallet,
  Bot,
  Receipt,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/invest", label: "Invest", icon: Building2 },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-border/50 bg-card/30 backdrop-blur-sm hidden lg:flex flex-col">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <item.icon
                className={cn("w-5 h-5", isActive && "text-gold-500")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions Area */}
      <div className="p-4 border-t border-border/50 space-y-1">
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          Help & Support
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all text-left"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
