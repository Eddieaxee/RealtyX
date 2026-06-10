import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// User-facing KYC status endpoint
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const record = await prisma.kYCRecord.findUnique({
    where: { userId: session.user.id },
  });

  // Backward-compatible shape for existing UI:
  // - older UI expects top-level fields: data.firstName, data.status, etc.
  // - keep kycRecord as well to support newer consumers.
  return NextResponse.json(
    {
      success: true,
      status: record?.status ?? null,
      // spread kycRecord fields to the top level (safe when record is null)
      ...(record ?? {}),
      kycRecord: record,
    },
    { status: 200 },
  );
}

export async function POST(req: Request) {
  // Backward compatibility for clients posting to /api/kyc
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Only allow fields that exist in the KYC model schema
  const allowedFields: Record<string, unknown> = {
    firstName: body.firstName,
    lastName: body.lastName,
    dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
    nationality: body.nationality,
    idType: body.idType,
    idNumber: body.idNumber,
    address: body.address,
    city: body.city,
    state: body.state,
    country: body.country,
    riskLevel: body.riskLevel,
    investorCategory: body.investorCategory,
    investmentGoals: body.investmentGoals,
    idDocumentUrl: body.idDocumentUrl,
    proofOfAddressUrl: body.proofOfAddressUrl,
    selfieUrl: body.selfieUrl,
    notes: body.notes,
  };

  // Remove undefined keys so they don't overwrite existing data
  const cleanFields = Object.fromEntries(
    Object.entries(allowedFields).filter(([, v]) => v !== undefined),
  );

  const targetStatus =
    body?.status && typeof body.status === "string" ? body.status : "SUBMITTED";

  // firstName and lastName are required by the KYCRecord schema
  const firstName = body.firstName || "";
  const lastName = body.lastName || "";

  const record = await prisma.kYCRecord.upsert({
    where: { userId: session.user.id },
    update: {
      status: targetStatus,
      ...cleanFields,
      submittedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      status: targetStatus,
      firstName,
      lastName,
      ...cleanFields,
      submittedAt: new Date(),
    },
  });

  return NextResponse.json(
    { success: true, kycRecord: record },
    { status: 200 },
  );
}
