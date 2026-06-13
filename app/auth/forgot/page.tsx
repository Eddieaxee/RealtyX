import { ForgotPasswordForm } from "@/components/onboarding/forgot-password-form";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata = {
  title: "Password Recovery — RealtyX",
  description:
    "Initiate secure account recovery protocols for your RealtyX investor profile.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090A0C] flex items-center justify-center">
          <LoadingSpinner className="w-8 h-8 text-[#E2B93B]" />
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";