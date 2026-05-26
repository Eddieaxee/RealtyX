import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(properties);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const property = await prisma.property.create({
      data: { ...body, slug: body.title.toLowerCase().replace(/\s+/g, "-") },
    });
    return NextResponse.json(property);
  } catch {
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 },
    );
  }
}
