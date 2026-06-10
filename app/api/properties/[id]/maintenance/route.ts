import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const maintenance = await prisma.maintenanceRequest.findMany({
      where: { propertyId: params.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(maintenance);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch maintenance requests" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const created = await prisma.maintenanceRequest.create({
      data: {
        propertyId: params.id,
        userId: session.user.id,
        title: body.title,
        description: body.description,
        priority: body.priority ?? "MEDIUM",
        scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
        estimatedCost: body.estimatedCost ?? null,
        status: body.status ?? "REPORTED",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create maintenance request" },
      { status: 500 },
    );
  }
}
