import { ResetPasswordForm } from "@/components/onboarding/reset-password-form";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata = {
  title: "Reset Password — RealtyX",
  description: "Set a new secure password for your RealtyX investor profile.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090A0C] flex items-center justify-center">
          <LoadingSpinner className="w-8 h-8 text-[#E2B93B]" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";