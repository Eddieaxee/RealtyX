"use client";

import { Sparkles } from "lucide-react";
import { AIChat } from "@/components/ai/ai-chat";

export default function AIAssistantPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 min-h-screen text-white bg-[#090A0C]">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#E2B93B]">
          <Sparkles className="w-3.5 h-3.5" /> Conversational Layer v1.0
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          AI Copilot Terminal
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Query cross-border capital distributions, extract asset parameters,
          and track real-time portfolio metrics.
        </p>
      </div>

      {/* Main Terminal Screen */}
      <div className="h-[520px]">
        <AIChat />
      </div>
    </div>
  );
}
