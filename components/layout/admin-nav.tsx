"use client";

import Link from "next/link";
import { Building2, Bell } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function AdminNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">Realty<span className="text-gradient-gold">X</span> <span className="text-xs text-muted-foreground font-normal">Admin</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <ConnectButton showBalance={false} accountStatus="address" chainStatus="icon" />
        </div>
      </div>
    </header>
  );
}