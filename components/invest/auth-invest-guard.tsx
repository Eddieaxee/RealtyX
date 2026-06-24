"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback } from "react";

/**
 * AuthInvestGuard - Strict client-side guard for investment actions.
 * When an unauthenticated user clicks "Invest Now" / "Purchase Fraction",
 * this halts the action and redirects to /signup?redirect=/properties/[propertyId].
 * After login, the user bounces back to complete the transaction.
 */
interface AuthInvestGuardProps {
  propertyId: string;
  children: (props: {
    execute: () => void;
    isAuthenticated: boolean;
  }) => ReactNode;
}

export function AuthInvestGuard({
  propertyId,
  children,
}: AuthInvestGuardProps) {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const execute = useCallback(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Strict guard: redirect unauthenticated users
      const encodedRedirect = encodeURIComponent(`/invest/${propertyId}`);
      router.push(`/auth/signup?redirect=${encodedRedirect}`);
      return;
    }

    // If authenticated, the parent component's onClick logic runs
    // This function is the gate: returning means proceed
  }, [isAuthenticated, isLoading, propertyId, router]);

  return <>{children({ execute, isAuthenticated })}</>;
}

/**
 * Higher-order function to wrap any click handler with auth checking.
 * Usage: const guardedClick = withAuthGuard(propertyId, router, handlePurchase);
 */
export function useAuthGuard(propertyId: string) {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const guardAction = useCallback(
    (action: () => void) => {
      if (isLoading) return;
      if (!isAuthenticated) {
        const encodedRedirect = encodeURIComponent(`/invest/${propertyId}`);
        router.push(`/auth/signup?redirect=${encodedRedirect}`);
        return;
      }
      action();
    },
    [isAuthenticated, isLoading, propertyId, router],
  );

  return { guardAction, isAuthenticated, isLoading };
}
