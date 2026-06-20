import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  const allowedFields = [
    "title", "description", "slug", "type", "status",
    "developmentStatus", "completionPercentage", "location",
    "city", "state", "country", "lat", "lng",
    "priceUSD", "priceNGN", "totalTokens", "availableTokens",
    "tokenPriceUSD", "tokenPriceNGN", "expectedReturn", "rentalYield",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  if (body.images) updateData.images = JSON.stringify(body.images);
  if (body.features) updateData.features = JSON.stringify(body.features);
  if (body.documents) updateData.documents = JSON.stringify(body.documents);

  try {
    const property = await prisma.property.update({
      where: { id: params.id },
      data: updateData,
    });
    return NextResponse.json({ success: true, property });
  } catch {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.property.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }
}