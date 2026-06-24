import { db } from "./db";

/**
 * KYC Guard - Enforces KYC verification before transactions
 *
 * Rules:
 * - Users must have APPROVED KYC before investing/buying tokens
 * - Users must have APPROVED KYC before withdrawing funds
 * - Users must have APPROVED KYC before selling tokens
 * - Admins are exempt from KYC requirements
 */

export type TransactionType = "INVESTMENT" | "WITHDRAWAL" | "SALE" | "PURCHASE";

export type KycStatus =
  | "NONE"
  | "PENDING"
  | "UNDER_REVIEW"
  | "REJECTED"
  | "VERIFIED"
  | "APPROVED";

interface KycGuardResult {
  allowed: boolean;
  reason?: string;
  kycStatus?: KycStatus;
}

export async function checkKycForTransaction(
  userId: string,
  transactionType: TransactionType,
): Promise<KycGuardResult> {
  // Admins can bypass KYC
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true, kycStatus: true },
  });

  if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
    return { allowed: true };
  }

  // Use denormalized kycStatus field on User model for fast check
  // Use nullish coalescing and then assert to avoid casting undefined directly
  const kycStatus: KycStatus = (user?.kycStatus ?? "NONE") as KycStatus;

  // Also check the detailed Kyc record for more granular status
  const kycRecord = await db.kyc.findUnique({
    where: { userId },
    select: { status: true },
  });

  const effectiveStatus: KycStatus =
    kycRecord?.status === "APPROVED" || kycStatus === "VERIFIED"
      ? "VERIFIED"
      : (kycRecord?.status as KycStatus) || kycStatus;

  // KYC must be VERIFIED for financial transactions
  if (effectiveStatus !== "VERIFIED" && effectiveStatus !== "APPROVED") {
    return {
      allowed: false,
      kycStatus: effectiveStatus,
      reason: getKycErrorMessage(transactionType, effectiveStatus),
    };
  }

  return { allowed: true, kycStatus: effectiveStatus };
}

function getKycErrorMessage(
  transactionType: TransactionType,
  kycStatus: string,
): string {
  const actionMap: Record<TransactionType, string> = {
    INVESTMENT: "invest in properties",
    WITHDRAWAL: "withdraw funds",
    SALE: "sell your tokens",
    PURCHASE: "purchase tokens",
  };

  const action = actionMap[transactionType];

  switch (kycStatus) {
    case "PENDING":
      return `Your KYC verification is pending. You cannot ${action} until your identity is verified. Please complete your KYC submission.`;
    case "UNDER_REVIEW":
      return `Your KYC is under review. You cannot ${action} at this time. Please wait for the verification to complete.`;
    case "REJECTED":
      return `Your KYC verification was rejected. You cannot ${action}. Please contact support or resubmit your KYC documents.`;
    default:
      return `KYC verification required. You cannot ${action} without completing identity verification.`;
  }
}

export async function requireKycForTransaction(
  userId: string,
  transactionType: TransactionType,
): Promise<void> {
  const result = await checkKycForTransaction(userId, transactionType);

  if (!result.allowed) {
    throw new Error(result.reason);
  }
}
