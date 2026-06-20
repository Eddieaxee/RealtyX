import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await prisma.kyc.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });

  const stats = {
    total: records.length,
    pending: records.filter((r) => r.status === "PENDING").length,
    approved: records.filter((r) => r.status === "APPROVED").length,
    rejected: records.filter((r) => r.status === "REJECTED").length,
  };

  return NextResponse.json({ success: true, records, stats });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, status, notes } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }

  const validStatuses = ["PENDING", "APPROVED", "REJECTED", "SUBMITTED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const record = await prisma.kyc.update({
    where: { id },
    data: { status, notes: notes || undefined },
  });

  return NextResponse.json({ success: true, record });
}