import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [totalUsers, totalInvestments, totalProperties, pendingKYC] = await Promise.all([
      prisma.user.count(),
      prisma.investment.count(),
      prisma.property.count(),
      prisma.kYCRecord.count({ where: { status: "SUBMITTED" } }),
    ]);
    return NextResponse.json({ totalUsers, totalInvestments, totalProperties, pendingKYC });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}