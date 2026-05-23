import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const kyc = await prisma.kYCRecord.findUnique({
      where: { userId: session.user.id },
    });
    return NextResponse.json(kyc);
  } catch {
    return NextResponse.json({ error: "Failed to fetch KYC" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const kyc = await prisma.kYCRecord.upsert({
      where: { userId: session.user.id },
      update: { ...body, status: "SUBMITTED", submittedAt: new Date() },
      create: { ...body, userId: session.user.id, status: "SUBMITTED", submittedAt: new Date() },
    });
    return NextResponse.json(kyc);
  } catch {
    return NextResponse.json({ error: "Failed to submit KYC" }, { status: 500 });
  }
}