"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I am your RealtyX AI Investment Copilot. I can help you with portfolio analysis, property recommendations, market insights, and investment strategies. What would you like to know?",
  },
];

const suggestedQuestions = [
  "What properties should I invest in?",
  "Analyze my portfolio performance",
  "What is the market outlook for Q3?",
  "How do I diversify my investments?",
];

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        "portfolio": "Based on your current holdings, I recommend increasing your allocation to commercial properties in tech hubs. Your current portfolio has a 65% residential weight, which is slightly above optimal. Consider the Berlin Tech Office for diversification.",
        "market": "The Q3 outlook shows strong momentum in US residential (+5.2%) and EU commercial (+3.8%). APAC markets are cooling slightly (-1.2%) but present buying opportunities. I recommend dollar-cost averaging into Manhattan and Miami assets.",
        "diversify": "To optimize diversification, consider: 1) Geographic spread (currently 70% US, target 50%), 2) Property type mix (add industrial/retail), 3) Risk tiers (blend high-yield with stable assets). The Dubai Marina and London properties offer good non-US exposure.",
        "properties": "Based on your risk profile and current allocations, I recommend: 1) Manhattan Penthouse (stable, 14.2% return), 2) Dubai Marina (high growth, 16.2% return), 3) Berlin Tech Office (diversification, 11.8% return). These complement your existing Miami holding well.",
      };

      const lowerInput = input.toLowerCase();
      let response = "I have analyzed your query. Based on current market conditions and your portfolio data, I recommend reviewing the latest property listings and considering dollar-cost averaging into high-yield assets. Would you like specific property recommendations or portfolio analysis?";

      for (const [key, value] of Object.entries(responses)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-border/50 bg-card/50 overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">AI Copilot</h3>
          <p className="text-xs text-muted-foreground">Powered by GPT-4</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-gold-500" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                }}
                className="px-3 py-1.5 rounded-full text-xs bg-muted hover:bg-muted/80 transition-colors border border-border/50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about investments, markets, or your portfolio..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="gradient-gold text-white">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}