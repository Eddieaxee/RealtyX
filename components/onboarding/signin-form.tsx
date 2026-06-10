"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Investor profile created successfully. Authorize parameters below to enter portal.");
    }
    if (searchParams.get("error") === "SessionRequired") {
      setError("Active authorization token expired. Please re-authenticate.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "ACCOUNT_RESTRICTED") {
          setError("Access denied. This investor profile has been administrative-locked.");
        } else {
          setError("Invalid cryptographic parameters or unauthorized email identity signature.");
        }
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Core network communication failure. Please verify connection rails.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#090A0C] text-white font-sans selection:bg-[#E2B93B]/30">
      {/* Cinematic Showcase Left Panel */}
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
            <ShieldCheck className="w-3.5 h-3.5" /> SEC & CBN Compliance Anchored
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15] text-balance">
            Sovereign Control Over Premium Asset Classes.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
            Sign in to manage your asset holdings, optimize multi-currency distributions, inspect live construction progress metrics, and deploy capital across tier-one African properties.
          </p>
          
          <div className="space-y-3 pt-4 border-t border-white/5 max-w-sm">
            <div className="flex items-start gap-3 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-[#E2B93B] shrink-0 mt-0.5" />
              <span>Real-time dividend tracking maps</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-[#E2B93B] shrink-0 mt-0.5" />
              <span>Institutional security and decentralized custody guardrails</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-neutral-500">
          © 2026 RealtyX Tech. Secure institutional platform.
        </div>
      </div>

      {/* Input Operations Interface Right Panel */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#0D0E12]">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              Authorize Account Access
            </h1>
            <p className="text-sm text-neutral-400">
              Provide authorization credentials to step inside your dashboard layer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs font-medium backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-200">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-medium backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-200">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Registered Email Address</label>
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

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Account Password</label>
                <Link href="/auth/forgot" className="text-xs text-[#E2B93B] hover:underline font-medium">
                  Recovery Protocols?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="pl-11 bg-[#13161C] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 h-11 rounded-xl transition-all"
                  required 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#f3c94a] hover:to-[#cb21] text-[#090A0C] font-semibold rounded-xl shadow-lg shadow-[#E2B93B]/5 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Verifying Identity Tokens..." : "Sign In to Secure Session"}
              <ArrowRight className="ml-2 w-4 h-4 stroke-[2.5]" />
            </Button>
          </form>

          <div className="text-center text-xs text-neutral-500 pt-2">
            New to the premium ecosystem?{" "}
            <Link href="/auth/signup" className="text-[#E2B93B] font-medium hover:underline tracking-wide">
              Establish Investor Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}