import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId, bvn, nin, idType, idDocumentUrl, proofOfAddressUrl } =
      await request.json();

    if (!userId || (!bvn && !nin)) {
      return NextResponse.json(
        { error: "Missing required compliance fields" },
        { status: 400 },
      );
    }

    const statusUpdate =
      bvn && bvn.startsWith("222") ? "REJECTED" : "UNDER_REVIEW";

    const complianceProfile = await prisma.kYCRecord.upsert({
      where: { userId },
      update: {
        idType: idType || (bvn ? "BVN" : "NIN"),
        idNumber: bvn || nin,
        ninNumber: nin || null,
        idDocumentUrl: idDocumentUrl || null,
        proofOfAddressUrl: proofOfAddressUrl || null,
        status: statusUpdate,
        submittedAt: new Date(),
      },
      create: {
        userId,
        firstName: "Unknown",
        lastName: "Unknown",
        idType: idType || (bvn ? "BVN" : "NIN"),
        idNumber: bvn || nin,
        ninNumber: nin || null,
        idDocumentUrl: idDocumentUrl || null,
        proofOfAddressUrl: proofOfAddressUrl || null,
        status: statusUpdate,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        profileId: complianceProfile.id,
        status: complianceProfile.status,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Compliance Processing Failure" },
      { status: 500 },
    );
  }
}
