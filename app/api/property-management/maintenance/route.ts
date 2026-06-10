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

    const requests = await prisma.maintenanceRequest.findMany({
      where,
      include: {
        property: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate maintenance stats
    const totalRequests = requests.length;
    const openRequests = requests.filter(
      (r) =>
        r.status === "REPORTED" ||
        r.status === "SCHEDULED" ||
        r.status === "IN_PROGRESS",
    ).length;
    const resolvedRequests = requests.filter(
      (r) => r.status === "RESOLVED",
    ).length;
    const totalEstimatedCost = requests
      .filter((r) => r.estimatedCost)
      .reduce((sum, r) => sum + Number(r.estimatedCost), 0);

    return NextResponse.json({
      requests,
      stats: {
        totalRequests,
        openRequests,
        resolvedRequests,
        totalEstimatedCost,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch maintenance requests" },
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
    const {
      propertyId,
      title,
      description,
      priority,
      scheduledDate,
      estimatedCost,
    } = body;

    const request = await prisma.maintenanceRequest.create({
      data: {
        propertyId,
        userId: session.user.id,
        title,
        description,
        priority: priority || "MEDIUM",
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        estimatedCost: estimatedCost || null,
        status: "REPORTED",
      },
      include: { property: true },
    });

    return NextResponse.json(request);
  } catch {
    return NextResponse.json(
      { error: "Failed to create maintenance request" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id, status, scheduledDate, estimatedCost } = body;

    const request = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(scheduledDate && { scheduledDate: new Date(scheduledDate) }),
        ...(estimatedCost !== undefined && { estimatedCost }),
      },
      include: { property: true },
    });

    return NextResponse.json(request);
  } catch {
    return NextResponse.json(
      { error: "Failed to update maintenance request" },
      { status: 500 },
    );
  }
}
