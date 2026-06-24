import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    firstName,
    lastName,
    dateOfBirth,
    nationality,
    idType,
    idNumber,
    ninNumber,
    idDocumentUrl,
    proofOfAddressUrl,
    selfieUrl,
    address,
    city,
    state,
    country,
    postalCode,
    phoneNumber,
    riskLevel,
    investorCategory,
    investmentGoals,
  } = await req.json();

  try {
    const record = await prisma.kyc.upsert({
      where: { userId: session.user.id },
      update: {
        status: "SUBMITTED",
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        nationality,
        idType,
        idNumber: idNumber ?? null,
        ninNumber: ninNumber ?? null,
        idDocumentUrl: idDocumentUrl ?? null,
        proofOfAddress: proofOfAddressUrl ?? null,
        selfieUrl: selfieUrl ?? null,
        address: address ?? null,
        city: city ?? null,
        state: state ?? null,
        country: country ?? null,
        postalCode: postalCode ?? null,
        phoneNumber: phoneNumber ?? null,
        riskLevel: riskLevel ?? "LOW",
        investorCategory: investorCategory ?? "RETAIL",
        investmentGoals: Array.isArray(investmentGoals) ? JSON.stringify(investmentGoals) : null,
        submittedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        status: "SUBMITTED",
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        nationality,
        idType,
        idNumber: idNumber ?? null,
        ninNumber: ninNumber ?? null,
        idDocumentUrl: idDocumentUrl ?? null,
        proofOfAddress: proofOfAddressUrl ?? null,
        selfieUrl: selfieUrl ?? null,
        address: address ?? null,
        city: city ?? null,
        state: state ?? null,
        country: country ?? null,
        postalCode: postalCode ?? null,
        phoneNumber: phoneNumber ?? null,
        riskLevel: riskLevel ?? "LOW",
        investorCategory: investorCategory ?? "RETAIL",
        investmentGoals: Array.isArray(investmentGoals) ? JSON.stringify(investmentGoals) : null,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, kycRecord: record },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to submit KYC" },
      { status: 500 },
    );
  }
}