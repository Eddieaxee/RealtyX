import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireKycForTransaction } from "@/lib/kyc-guard";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const investments = await db.investment.findMany({
      where: { userId: session.user.id },
      include: { property: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(investments);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch investments" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Enforce KYC before investment
    await requireKycForTransaction(session.user.id, "INVESTMENT");

    const body = await req.json();
    const investment = await db.investment.create({
      data: { ...body, userId: session.user.id, status: "PENDING" },
    });
    return NextResponse.json(investment);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, code: "KYC_REQUIRED" },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 },
    );
  }
}
