import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Admin Transaction Ledger API
 * 
 * Centralized administrative master database dashboard table.
 * Allows admins to view, search, and filter every transaction
 * running across the system by User ID, gateway, type, and status.
 */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const type = searchParams.get("type"); // INVESTMENT | WITHDRAWAL | DEPOSIT | DIVIDEND | all
    const status = searchParams.get("status"); // PENDING | SUCCESS | FAILED | CANCELLED | all
    const gateway = searchParams.get("gateway"); // SPENDEX | PAYSTACK | OPAY | WEB3 | all
    const userId = searchParams.get("userId");
    const search = searchParams.get("search")?.toLowerCase();
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: Record<string, unknown> = {};

    if (type && type !== "all") where.type = type;
    if (status && status !== "all") where.status = status;
    if (gateway && gateway !== "all") where.gateway = gateway;
    if (userId) where.userId = userId;

    // Build query
    const [transactions, total] = await Promise.all([
      db.transaction.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.transaction.count({ where }),
    ]);

    // Apply search filter (client-side for flexibility)
    let filtered = transactions;
    if (search) {
      filtered = transactions.filter(
        (t) =>
          t.user.name?.toLowerCase().includes(search) ||
          t.user.email?.toLowerCase().includes(search) ||
          t.txReference?.toLowerCase().includes(search) ||
          t.providerRef?.toLowerCase().includes(search) ||
          t.id.toLowerCase().includes(search)
      );
    }

    // Compute stats
    const stats = {
      totalTransactions: total,
      totalVolumeUSD: transactions.reduce((sum, t) => sum + t.amountUSD, 0),
      pendingCount: transactions.filter((t) => t.status === "PENDING").length,
      successCount: transactions.filter((t) => t.status === "SUCCESS").length,
      failedCount: transactions.filter((t) => t.status === "FAILED").length,
      depositCount: transactions.filter((t) => t.type === "DEPOSIT").length,
      investmentCount: transactions.filter((t) => t.type === "INVESTMENT").length,
      withdrawalCount: transactions.filter((t) => t.type === "WITHDRAWAL").length,
    };

    return NextResponse.json({
      success: true,
      transactions: filtered,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}