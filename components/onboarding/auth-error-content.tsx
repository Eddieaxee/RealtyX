"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Building2, AlertTriangle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Server Configuration Error",
    description: "There is a problem with the server configuration. Please contact support.",
  },
  AccessDenied: {
    title: "Access Denied",
    description: "You do not have permission to sign in. Contact your administrator.",
  },
  Verification: {
    title: "Verification Failed",
    description: "The verification link may have expired or already been used.",
  },
  Default: {
    title: "Authentication Error",
    description: "An unexpected error occurred during authentication. Please try again.",
  },
};

export function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error") || "Default";
  const error = errorMessages[errorType] || errorMessages.Default;

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
          <h2 className="text-4xl font-extrabold tracking-tight leading-[1.15]">
            Authentication Exception Detected.
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
            The system encountered an issue while processing your authentication request. Review the details and try again.
          </p>
        </div>
        <div className="relative z-10 text-xs text-neutral-500">© 2026 RealtyX Tech.</div>
      </div>

      {/* Error Right Panel */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-[#0D0E12]">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {error.title}
            </h1>
            <p className="text-sm text-neutral-400">{error.description}</p>
            {errorType !== "Default" && (
              <p className="text-xs text-neutral-500 font-mono mt-2">Error code: {errorType}</p>
            )}
          </div>
          <div className="space-y-3">
            <Link href="/auth/signin">
              <Button className="w-full h-11 bg-gradient-to-r from-[#E2B93B] to-[#B89221] hover:from-[#f3c94a] hover:to-[#cbab3a] text-[#090A0C] font-semibold rounded-xl shadow-lg shadow-[#E2B93B]/5 transition-all flex items-center justify-center">
                Try Again
                <ArrowRight className="ml-2 w-4 h-4 stroke-[2.5]" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full h-11 text-neutral-400 hover:text-white rounded-xl flex items-center justify-center">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}