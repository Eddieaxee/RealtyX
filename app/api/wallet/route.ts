import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireKycForTransaction } from "@/lib/kyc-guard";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wallet = await db.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json({
        success: true,
        connected: false,
        address: null,
        network: "polygon",
        balance: { usd: 0, ngn: 0 },
        totalInvested: 0,
        totalReturns: 0,
        message: "No wallet found. Please connect your wallet.",
      });
    }

    return NextResponse.json({
      success: true,
      connected: !!wallet.walletAddress,
      address: wallet.walletAddress,
      network: "polygon",
      balance: { usd: wallet.balanceUSD, ngn: wallet.balanceNGN },
      totalInvested: wallet.totalInvested,
      totalReturns: wallet.totalReturns,
      totalWithdrawn: wallet.totalWithdrawn,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { address, network } = body;

    if (!address) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    // Save or update wallet address
    const wallet = await db.wallet.upsert({
      where: { userId: session.user.id },
      update: { walletAddress: address },
      create: {
        userId: session.user.id,
        walletAddress: address,
        balanceUSD: 0,
        balanceNGN: 0,
        totalInvested: 0,
        totalReturns: 0,
        totalWithdrawn: 0,
      },
    });

    return NextResponse.json({
      success: true,
      connected: true,
      address: wallet.walletAddress,
      network: network || "polygon",
      message: "Wallet connected successfully",
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// Withdrawal endpoint - enforces KYC
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Enforce KYC before withdrawal
    await requireKycForTransaction(session.user.id, "WITHDRAWAL");

    const body = await req.json();
    const { amount, currency, bankAccount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
    }

    // Create withdrawal transaction
    const transaction = await db.transaction.create({
      data: {
        userId: session.user.id,
        type: "WITHDRAWAL",
        amountUSD: currency === "USD" ? amount : 0,
        amountNGN: currency === "NGN" ? amount : 0,
        status: "PENDING",
        paymentMethod: "BANK_TRANSFER",
        metadata: JSON.stringify({ bankAccount }),
      },
    });

    return NextResponse.json({
      success: true,
      transaction,
      message: "Withdrawal request submitted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, code: "KYC_REQUIRED" },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: "Failed to process withdrawal" },
      { status: 500 },
    );
  }
}
