import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { kycId, action, notes } = await req.json();

  if (!kycId || !action || !["APPROVE", "REJECT"].includes(action)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const targetStatus = action === "APPROVE" ? "APPROVED" : "REJECTED";

  try {
    const updated = await prisma.kyc.update({
      where: { id: kycId },
      data: {
        status: targetStatus,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        notes: notes ?? null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `KYC_${action}`,
        resource: "Kyc",
        resourceId: kycId,
        metadata: JSON.stringify({
          oldValue: { status: "PENDING" },
          newValue: { status: targetStatus },
        }),
        ipAddress: null,
        userAgent: null,
      },
    });

    await prisma.notification.create({
      data: {
        userId: updated.userId,
        type: "KYC",
        title: "KYC Status Updated",
        message:
          targetStatus === "APPROVED"
            ? "Your identity verification has been approved. You can now continue investing."
            : "Your KYC submission has been rejected. Please review your documents and try again.",
        metadata: { status: targetStatus },
      },
    });

    return NextResponse.json(
      { success: true, kycRecord: updated },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to update KYC" },
      { status: 500 },
    );
  }
}
