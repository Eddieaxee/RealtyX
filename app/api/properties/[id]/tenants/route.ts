import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tenants = await prisma.propertyTenant.findMany({
      where: { propertyId: id },
      orderBy: { leaseStart: "asc" },
    });

    return NextResponse.json(tenants);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch property tenants" },
      { status: 500 },
    );
  }
}
