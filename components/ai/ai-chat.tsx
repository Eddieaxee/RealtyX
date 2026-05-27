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
    content:
      "Hello! I am your RealtyX AI Investment Copilot. I can help you with portfolio analysis, property recommendations, market insights, and investment strategies. What would you like to know?",
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

  // Modified to optionally accept a direct string (for suggested questions)
  const handleSend = async (customInput?: string) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    // 1. Generate and append the user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Connect directly to your internal Next.js API route
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Sending the entire history so the AI retains conversational memory
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate AI response");
      }

      const data = await response.json();

      // 3. Append the real AI assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          data.content ||
          data.text ||
          "I processed your request but returned an empty response.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      // Graceful user-facing error message fallback
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting to the network right now. Please try your request again shortly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce bounce-delay-0" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce bounce-delay-1" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce bounce-delay-2" />
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
                onClick={() => handleSend(q)} // Instantly sends the message on click
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
          <Button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="gradient-gold text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
