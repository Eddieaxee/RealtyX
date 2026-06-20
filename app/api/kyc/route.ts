import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// User-facing KYC status endpoint
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await prisma.kyc.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(
    {
      success: true,
      status: record?.status ?? null,
      ...(record ?? {}),
      kycRecord: record,
    },
    { status: 200 },
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const allowedFields: Record<string, unknown> = {
    firstName: body.firstName,
    lastName: body.lastName,
    dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
    phoneNumber: body.phoneNumber,
    address: body.address,
    country: body.country,
    idType: body.idType,
    idNumber: body.idNumber,
  };

  const cleanFields = Object.fromEntries(
    Object.entries(allowedFields).filter(([, v]) => v !== undefined),
  );

  const targetStatus =
    body?.status && typeof body.status === "string" ? body.status : "PENDING";

  const firstName = body.firstName || "";
  const lastName = body.lastName || "";

  const record = await prisma.kyc.upsert({
    where: { userId: session.user.id },
    update: {
      status: targetStatus,
      ...cleanFields,
    },
    create: {
      userId: session.user.id,
      status: targetStatus,
      firstName,
      lastName,
      ...cleanFields,
    },
  });

  return NextResponse.json(
    { success: true, kycRecord: record },
    { status: 200 },
  );
}