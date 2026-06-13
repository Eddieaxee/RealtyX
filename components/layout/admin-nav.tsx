"use client";

import Link from "next/link";
import { Building2, Bell, Shield, ChevronDown, Search } from "lucide-react";
import { useState } from "react";

export function AdminNav() {
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-[#090A0C]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Brand + Search */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center shadow-lg shadow-[#E2B93B]/10">
              <Building2 className="w-4 h-4 text-black" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white">
                Realty<span className="text-[#E2B93B]">X</span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E2B93B]/60 bg-[#E2B93B]/5 px-1.5 py-0.5 rounded border border-[#E2B93B]/10">
                Principal
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 bg-[#13161C] border border-white/5 rounded-xl px-3 h-9 w-64">
            <Search className="w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search platform..."
              className="bg-transparent text-xs text-white placeholder:text-neutral-500 outline-none w-full font-mono"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
              SYSTEMS NOMINAL
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Bell className="w-4 h-4 text-neutral-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-[#13161C] border border-white/5 rounded-2xl shadow-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Platform Alerts
                </h4>
                {[
                  { text: "New KYC submission requires review", time: "2m ago", color: "text-amber-400" },
                  { text: "Large investment: $50,000 detected", time: "15m ago", color: "text-emerald-400" },
                  { text: "System backup completed successfully", time: "1h ago", color: "text-blue-400" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.color}`} />
                    <div>
                      <p className="text-xs text-white">{n.text}</p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center text-black font-black text-[10px]">
              ADM
            </div>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </button>
        </div>
      </div>
    </header>
  );
}