"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RecoveryMethod = "email" | "sms" | "2fa";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<RecoveryMethod>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const recoveryMethods = [
    {
      id: "email" as RecoveryMethod,
      label: "Email Reset",
      description: "Send a secure reset link to your registered email",
      icon: Mail,
    },
    {
      id: "sms" as RecoveryMethod,
      label: "SMS Verification",
      description: "Receive a one-time code via SMS to your registered phone",
      icon: MessageSquare,
    },
    {
      id: "2fa" as RecoveryMethod,
      label: "Two-Factor Auth",
      description: "Verify using your authenticator app or backup codes",
      icon: KeyRound,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), method: selectedMethod }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Recovery request failed");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to process recovery request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen grid lg:grid-cols-12 bg-[#090A0C] text-white font-sans selection:bg-[#E2B93B]/30">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#161920] via-[#0D0E12] to-[#090A0C]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E2B93B_1px,transparent_1px)] [background-size:16px_16px]" />
          <Link href="/" className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center shadow-lg shadow-[#E2B93B]/10">
              <Building2 className="w-5 h-5 text-[#090A0C]" />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">
              Realty<span className="text-[#E2B93B]">X</span>
            </span>
          </Link>
          <div className="relative z-10 space-y-6 my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E2B93B]/20 bg-[#E2B93B]/5 text-[#E2B93B] text-xs font-medium tracking-wide backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Recovery Protocol
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15] text-balance">
              Recovery Instructions Dispatched.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              Follow the secure instructions sent to your registered contact method to restore access to your investor profile.
            </p>
          </div>
          <div className="relative z-10 text-xs text-neutral-500">
            © 2026 RealtyX Tech. Secure institutional platform.
          </div>
        </div>

        {/* Success Right Panel */}
        <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#0D0E12]">
          <div className="w-full max-w-md space-y-8">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                Recovery Initiated
              </h1>
              <p className="text-sm text-neutral-400">
                {selectedMethod === "email" && (
                  <>A secure recovery link has been dispatched to <span className="text-[#E2B93B] font-medium">{email}</span>. Check your inbox and spam folder.</>
                )}
                {selectedMethod === "sms" && (
                  <>A one-time verification code has been sent via SMS to your registered phone number. The code expires in 10 minutes.</>
                )}
                {selectedMethod === "2fa" && (
                  <>Open your authenticator app to generate a verification code, or use one of your backup recovery codes.</>
                )}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#f3c94a] hover:to-[#cbab3a] text-[#090A0C] font-semibold rounded-xl shadow-lg shadow-[#E2B93B]/5 transition-all"
              >
                {selectedMethod === "2fa" ? "Verify with Authenticator" : "Enter Recovery Code"}
                <ArrowRight className="ml-2 w-4 h-4 stroke-[2.5]" />
              </Button>
              <Link href="/auth/signin">
                <Button
                  variant="ghost"
                  className="w-full h-11 text-neutral-400 hover:text-white rounded-xl"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#090A0C] text-white font-sans selection:bg-[#E2B93B]/30">
      {/* Cinematic Left Panel */}
      <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#161920] via-[#0D0E12] to-[#090A0C]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E2B93B_1px,transparent_1px)] [background-size:16px_16px]" />
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center shadow-lg shadow-[#E2B93B]/10">
            <Building2 className="w-5 h-5 text-[#090A0C]" />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">
            Realty<span className="text-[#E2B93B]">X</span>
          </span>
        </Link>
        <div className="relative z-10 space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E2B93B]/20 bg-[#E2B93B]/5 text-[#E2B93B] text-xs font-medium tracking-wide backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" /> Account Recovery System
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15] text-balance">
            Restore Access to Your Investor Portal.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
            Choose your preferred recovery method and we{'\''}ll guide you through the secure account restoration process.
          </p>
          <div className="space-y-3 pt-4 border-t border-white/5 max-w-sm">
            <div className="flex items-start gap-3 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-[#E2B93B] shrink-0 mt-0.5" />
              <span>Multi-factor authentication recovery options</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-[#E2B93B] shrink-0 mt-0.5" />
              <span>End-to-end encrypted recovery tokens</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-[#E2B93B] shrink-0 mt-0.5" />
              <span>24/7 institutional support available</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-xs text-neutral-500">
          © 2026 RealtyX Tech. Secure institutional platform.
        </div>
      </div>

      {/* Recovery Form Right Panel */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#0D0E12]">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <Link href="/auth/signin" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#E2B93B] transition-colors mb-4">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              Account Recovery
            </h1>
            <p className="text-sm text-neutral-400">
              Select a recovery method to restore access to your account.
            </p>
          </div>

          {/* Recovery Method Selection */}
          <div className="space-y-3">
            {recoveryMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  selectedMethod === method.id
                    ? "border-[#E2B93B]/30 bg-[#E2B93B]/5"
                    : "border-white/5 bg-[#13161C]/50 hover:border-white/10"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedMethod === method.id
                    ? "bg-[#E2B93B]/10 text-[#E2B93B]"
                    : "bg-white/5 text-neutral-500"
                }`}>
                  <method.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold ${selectedMethod === method.id ? "text-white" : "text-neutral-300"}`}>
                    {method.label}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">{method.description}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedMethod === method.id
                    ? "border-[#E2B93B]"
                    : "border-neutral-700"
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 rounded-full bg-[#E2B93B]" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-medium backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-200">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 bg-[#13161C] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 h-11 rounded-xl transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#f3c94a] hover:to-[#cbab3a] text-[#090A0C] font-semibold rounded-xl shadow-lg shadow-[#E2B93B]/5 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Dispatching Recovery Protocol..." : `Initiate ${selectedMethod === "email" ? "Email" : selectedMethod === "sms" ? "SMS" : "2FA"} Recovery`}
              <ArrowRight className="ml-2 w-4 h-4 stroke-[2.5]" />
            </Button>
          </form>

          <div className="text-center text-xs text-neutral-500 pt-2">
            Remember your credentials?{" "}
            <Link href="/auth/signin" className="text-[#E2B93B] font-medium hover:underline tracking-wide">
              Sign In to Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}