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

interface KycGuardResult {
  allowed: boolean;
  reason?: string;
  kycStatus?: string;
}

export async function checkKycForTransaction(
  userId: string,
  transactionType: TransactionType
): Promise<KycGuardResult> {
  // Admins can bypass KYC
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
    return { allowed: true };
  }

  // Get user's KYC status
  const kyc = await db.kyc.findUnique({
    where: { userId },
    select: { status: true },
  });

  const kycStatus = kyc?.status || "PENDING";

  // KYC must be APPROVED for financial transactions
  if (kycStatus !== "APPROVED") {
    return {
      allowed: false,
      kycStatus,
      reason: getKycErrorMessage(transactionType, kycStatus),
    };
  }

  return { allowed: true, kycStatus };
}

function getKycErrorMessage(transactionType: TransactionType, kycStatus: string): string {
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
  transactionType: TransactionType
): Promise<void> {
  const result = await checkKycForTransaction(userId, transactionType);

  if (!result.allowed) {
    throw new Error(result.reason);
  }
}