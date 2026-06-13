import { SignInForm } from "@/components/onboarding/signin-form";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata = {
  title: "Authorize Access — RealtyX Portal Interface",
  description:
    "Authenticate security parameters to access your sovereign fractional real estate asset ledger.",
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090A0C] flex items-center justify-center">
          <LoadingSpinner className="w-8 h-8 text-[#E2B93B]" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
