"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const systemContext = `You are RealtyX AI, a professional real estate investment advisor specializing in Nigerian and African real estate markets. You help users with:
- Portfolio analysis and diversification strategies
- Property market insights and trends in Lagos, Abuja, and other Nigerian cities
- Risk assessment and return projections
- Regulatory and tax considerations for Nigerian real estate
- Tokenized real estate mechanics and blockchain investments
- Capital calls, distributions, and secondary market trading
Be concise, data-driven, and professional. Always include disclaimers that this is not financial advice.`;

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Greetings. I am your RealtyX Quantitative Intelligence Node. Ask me about secondary market order spreads, asset yields, or capital call distributions.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", text: userMsg },
    ];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemContext },
            ...updatedMessages.map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.text,
            })),
          ],
        }),
      });

      if (!res.ok) {
        throw new Error("AI service error");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            data.content ||
            "I processed your request but returned an empty response.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Our AI service is temporarily unavailable. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="border border-white/5 bg-[#0D0E12] rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden">
        {/* Top Status Strip */}
        <div className="px-4 py-3 bg-[#090A0C]/50 border-b border-white/5 flex items-center justify-between font-mono text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Node Core: SEC-A1_ONLINE</span>
          </div>
          <span>Context: Fractional Assets Engine</span>
        </div>

        {/* Message Thread Box */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 max-w-3xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              <div
                className={`p-2 rounded-xl shrink-0 border ${msg.role === "user" ? "bg-white/5 border-white/10 text-white" : "bg-[#E2B93B]/10 border-[#E2B93B]/20 text-[#E2B93B]"}`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                  msg.role === "user"
                    ? "bg-[#13161C] border-white/5 text-neutral-200 rounded-tr-none"
                    : "bg-[#090A0C]/80 border-white/5 text-neutral-300 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl shrink-0 border bg-[#E2B93B]/10 border-[#E2B93B]/20 text-[#E2B93B]">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#090A0C]/80 border border-white/5 text-neutral-300 rounded-tl-none">
                <Loader2 className="w-4 h-4 animate-spin text-[#E2B93B]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Console Inputs Form */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-[#090A0C]/40 border-t border-white/5 flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about assets, secondary order depths, or payout updates..."
            className="bg-[#090A0C] border-white/5 text-xs text-white focus-visible:ring-[#E2B93B]/20 h-11"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#E2B93B] hover:bg-[#B89221] text-black font-bold h-11 px-4 rounded-xl shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
