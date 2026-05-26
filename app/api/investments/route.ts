import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const investments = await prisma.investment.findMany({
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
    const body = await req.json();
    const investment = await prisma.investment.create({
      data: { ...body, userId: session.user.id, status: "PENDING" },
    });
    return NextResponse.json(investment);
  } catch {
    return NextResponse.json(
      { error: "Failed to create investment" },
      { status: 500 },
    );
  }
}
