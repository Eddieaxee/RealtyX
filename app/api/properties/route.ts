import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      where: { status: "AVAILABLE" },
    });

    return NextResponse.json({ success: true, properties });
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return NextResponse.json({ success: false, properties: [] }, { status: 500 });
  }
}