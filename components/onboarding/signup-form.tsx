"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oAuthLoading, setOAuthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOAuthSignIn = async (provider: string) => {
    setOAuthLoading(provider);
    setError("");
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch {
      setError(
        `${provider} authentication encountered a config error. Provider keys may not be configured yet.`,
      );
    } finally {
      setOAuthLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match verification.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(
        "Account password must contain at least 8 cryptographic characters.",
      );
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error || "Registration failed. Please verify your credentials.",
        );
        return;
      }

      // Auto-login after registration
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/auth/signin?registered=true");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError(
        "Network error during registration. Please check your connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[#090A0C] text-white font-sans selection:bg-[#E2B93B]/30">
      {/* Cinematic Showcase Left Panel */}
      <div className="flex lg:hidden items-center justify-center pt-8 pb-2">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E2B93B] to-[#B89221] flex items-center justify-center shadow-lg shadow-[#E2B93B]/10">
            <Building2 className="w-5 h-5 text-[#090A0C]" />
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">
            Realty<span className="text-[#E2B93B]">X</span>
          </span>
        </Link>
      </div>

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
            <ShieldCheck className="w-3.5 h-3.5" /> SEC & CBN Compliance
            Anchored
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15] text-balance">
            Establish Your Sovereign Investment Profile.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
            Create your account to access fractional real estate investment
            opportunities across Africa fastest-growing markets.
          </p>

          <div className="space-y-3 pt-4 border-t border-white/5 max-w-sm">
            <div className="flex items-start gap-3 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-[#E2B93B] shrink-0 mt-0.5" />
              <span>Automated KYC/AML verification pipeline</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-[#E2B93B] shrink-0 mt-0.5" />
              <span>Multi-currency settlement (USD/NGN)</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-[#E2B93B] shrink-0 mt-0.5" />
              <span>Institutional-grade custody and compliance</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-neutral-500">
          © 2026 RealtyX Tech. Secure institutional platform.
        </div>
      </div>

      {/* Registration Form Right Panel */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#0D0E12]">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              Create Investor Profile
            </h1>
            <p className="text-sm text-neutral-400">
              Begin your journey into tokenized real estate investment.
            </p>
          </div>

          {/* OAuth Provider Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("google")}
              disabled={oAuthLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oAuthLoading === "google" ? (
                <svg
                  className="animate-spin w-5 h-5 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {oAuthLoading === "google"
                ? "Connecting..."
                : "Continue with Google"}
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn("microsoft")}
              disabled={oAuthLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oAuthLoading === "microsoft" ? (
                <svg
                  className="animate-spin w-5 h-5 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path
                    d="M11.55 21H3v-8.55h8.55V21zM21 21h-8.55v-8.55H21V21zM11.55 3V11.45H3V3h8.55zM21 11.45H12.45V3H21v8.45z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {oAuthLoading === "microsoft"
                ? "Connecting..."
                : "Continue with Microsoft"}
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn("apple")}
              disabled={oAuthLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oAuthLoading === "apple" ? (
                <svg
                  className="animate-spin w-5 h-5 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path
                    d="M17.569 12.625c-.066-2.176 1.395-3.292 1.489-3.383-.817-1.198-2.074-1.362-2.51-1.377-1.046-.112-2.061.63-2.594.63-.55 0-1.374-.611-2.264-.594-1.146.018-2.21.674-2.818 1.718-1.215 2.143-.312 5.293.857 7.024.574.855 1.267 1.802 2.186 1.767.861-.034 1.201-.574 2.243-.574 1.028 0 1.33.574 2.244.55.934-.019 1.522-.858 2.064-1.726.667-1.017.92-1.996.935-2.048-.02-.008-1.783-.692-1.832-2.787zM14.898 7.41c.47-.588.792-1.384.699-2.21-.682.03-1.498.464-1.977 1.029-.427.505-.799 1.312-.693 2.079.744.058 1.466-.387 1.971-.898z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {oAuthLoading === "apple"
                ? "Connecting..."
                : "Continue with Apple"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#0D0E12] px-4 text-neutral-500 font-mono">
                  OR SECURE WITH CREDENTIALS
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-medium backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-200">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="John A. Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 bg-[#13161C] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 h-11 rounded-xl transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Email Address
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 bg-[#13161C] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 h-11 rounded-xl transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11 pr-11 bg-[#13161C] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 h-11 rounded-xl transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#f3c94a] hover:to-[#cbab3a] text-[#090A0C] font-semibold rounded-xl shadow-lg shadow-[#E2B93B]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading
                ? "Establishing Profile..."
                : "Create Secure Investor Profile"}
              <ArrowRight className="ml-2 w-4 h-4 stroke-[2.5]" />
            </Button>
          </form>

          <div className="text-center text-xs text-neutral-500 pt-2">
            Already have an investor profile?{" "}
            <Link
              href="/auth/signin"
              className="text-[#E2B93B] font-medium hover:underline tracking-wide"
            >
              Authorize Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
