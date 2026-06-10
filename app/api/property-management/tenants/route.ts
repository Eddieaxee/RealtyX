import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");

    const where: Record<string, unknown> = {};
    if (propertyId) {
      where.propertyId = propertyId;
    }

    const tenants = await prisma.propertyTenant.findMany({
      where,
      include: { property: true },
      orderBy: { createdAt: "desc" },
    });

    // Calculate occupancy stats
    const totalTenants = tenants.length;
    const activeTenants = tenants.filter(
      (t) => t.occupancyStatus === "ACTIVE",
    ).length;
    const totalRentNGN = tenants
      .filter((t) => t.occupancyStatus === "ACTIVE")
      .reduce((sum, t) => sum + Number(t.rentAmountNGN), 0);

    return NextResponse.json({
      tenants,
      stats: {
        totalTenants,
        activeTenants,
        vacancyRate:
          totalTenants > 0
            ? ((totalTenants - activeTenants) / totalTenants) * 100
            : 0,
        totalRentNGN,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
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
    const { propertyId, tenantName, leaseStart, leaseEnd, rentAmountNGN } =
      body;

    const tenant = await prisma.propertyTenant.create({
      data: {
        propertyId,
        tenantName,
        leaseStart: new Date(leaseStart),
        leaseEnd: new Date(leaseEnd),
        rentAmountNGN,
        occupancyStatus: "ACTIVE",
      },
      include: { property: true },
    });

    return NextResponse.json(tenant);
  } catch {
    return NextResponse.json(
      { error: "Failed to create tenant" },
      { status: 500 },
    );
  }
}
