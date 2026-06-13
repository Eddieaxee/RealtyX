import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AuthErrorContent } from "@/components/onboarding/auth-error-content";

export const metadata = {
  title: "Authentication Error — RealtyX",
  description: "An authentication error occurred. Please try again.",
};

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090A0C] flex items-center justify-center">
          <LoadingSpinner className="w-8 h-8 text-[#E2B93B]" />
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";