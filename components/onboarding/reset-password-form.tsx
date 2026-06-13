"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[!@#$%^&*(),.?\":{}|<>]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Password reset failed. The token may have expired.");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen grid lg:grid-cols-12 bg-[#090A0C] text-white font-sans selection:bg-[#E2B93B]/30">
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
            <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15]">
              Invalid Recovery Link.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>
          <div className="relative z-10 text-xs text-neutral-500">© 2026 RealtyX Tech.</div>
        </div>
        <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#0D0E12]">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
              <Lock className="w-10 h-10 text-red-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Expired Link
              </h1>
              <p className="text-sm text-neutral-400">
                This reset link has expired or is invalid. Request a new recovery link.
              </p>
            </div>
            <Link href="/auth/forgot">
              <Button className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-[#090A0C] font-semibold rounded-xl">
                Request New Reset Link
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen grid lg:grid-cols-12 bg-[#090A0C] text-white font-sans selection:bg-[#E2B93B]/30">
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
            <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15]">
              Password Restored Successfully.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
              Your new cryptographic parameters have been committed. You may now access your investor portal.
            </p>
          </div>
          <div className="relative z-10 text-xs text-neutral-500">© 2026 RealtyX Tech.</div>
        </div>
        <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#0D0E12]">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Password Reset Complete
              </h1>
              <p className="text-sm text-neutral-400">
                Your password has been updated. You can now sign in with your new credentials.
              </p>
            </div>
            <Link href="/auth/signin">
              <Button className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] text-[#090A0C] font-semibold rounded-xl">
                Sign In to Portal
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <ShieldCheck className="w-3.5 h-3.5" /> Secure Password Reset
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15] text-balance">
            Establish New Security Parameters.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
            Create a strong, unique password to protect your investor account and asset holdings.
          </p>
        </div>
        <div className="relative z-10 text-xs text-neutral-500">© 2026 RealtyX Tech.</div>
      </div>

      {/* Reset Form Right Panel */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#0D0E12]">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <Link href="/auth/forgot" className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#E2B93B] transition-colors mb-4">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Recovery
            </Link>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-sm text-neutral-400">
              Enter your new password below. Choose a strong, unique combination.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-medium backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-200">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                New Password
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
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              {passwordRequirements.map((req) => (
                <div key={req.label} className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      req.met ? "text-emerald-400" : "text-neutral-600"
                    }`}
                  />
                  <span className={req.met ? "text-emerald-400" : "text-neutral-500"}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11 bg-[#13161C] border-neutral-800 text-white placeholder:text-neutral-600 focus:border-[#E2B93B] focus:ring-[#E2B93B]/10 h-11 rounded-xl transition-all"
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#f3c94a] hover:to-[#cbab3a] text-[#090A0C] font-semibold rounded-xl shadow-lg shadow-[#E2B93B]/5 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !passwordRequirements.every((r) => r.met) || password !== confirmPassword}
            >
              {isLoading ? "Committing New Parameters..." : "Reset Password"}
              <ArrowRight className="ml-2 w-4 h-4 stroke-[2.5]" />
            </Button>
          </form>

          <div className="text-center text-xs text-neutral-500 pt-2">
            Remembered your password?{" "}
            <Link href="/auth/signin" className="text-[#E2B93B] font-medium hover:underline tracking-wide">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}