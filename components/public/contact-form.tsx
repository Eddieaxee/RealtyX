"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setIsSubmitted(true);
    } catch {
      setError("Unable to send message. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-border/50 bg-card/50 text-center">
        <CheckCircle2 className="w-16 h-16 text-[#E2B93B] mb-4" />
        <h3 className="text-2xl font-bold mb-2">Message Sent</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for reaching out. Our team will respond within 24 hours.
        </p>
        <Button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
          }}
          variant="outline"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-border/50 bg-card/50 space-y-5">
      <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
      
      {error && (
        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
          <Input
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-background border-border focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 h-11 rounded-xl"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-background border-border focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 h-11 rounded-xl"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
        <Input
          type="text"
          placeholder="How can we help?"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="bg-background border-border focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 h-11 rounded-xl"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message</label>
        <textarea
          placeholder="Tell us more about your inquiry..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full min-h-[140px] p-4 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 focus:outline-none focus:ring-1 resize-none transition-all"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#f3c94a] hover:to-[#cbab3a] text-[#090A0C] font-semibold rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
        <Send className="ml-2 w-4 h-4" />
      </Button>
    </form>
  );
}