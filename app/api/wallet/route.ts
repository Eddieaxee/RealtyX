import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const wallets = await prisma.wallet.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(wallets);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch wallets" },
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
    const wallet = await prisma.wallet.create({
      data: { ...body, userId: session.user.id },
    });
    return NextResponse.json(wallet);
  } catch {
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 },
    );
  }
}
