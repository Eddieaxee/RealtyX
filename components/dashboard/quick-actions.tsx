"use client";

import Link from "next/link";
import { Building2, Wallet, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { href: "/invest", label: "Invest in Property", icon: Building2, description: "Browse available assets" },
  { href: "/wallet", label: "Add Funds", icon: Wallet, description: "Deposit to your wallet" },
  { href: "/ai-assistant", label: "AI Insights", icon: Bot, description: "Get portfolio advice" },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-6">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-3 px-4 group hover:border-gold-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <action.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}