import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET: List KYC records with optional status filter
export async function GET(req: Request) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (statusFilter && statusFilter !== "ALL") {
      where.status = statusFilter;
    } else {
      where.OR = [{ status: "SUBMITTED" }, { status: "UNDER_REVIEW" }];
    }

    const records = await prisma.kYCRecord.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      take: 100,
    });

    return NextResponse.json({ success: true, records }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch KYC records" },
      { status: 500 },
    );
  }
}

// POST: Approve or reject a KYC record
export async function POST(req: Request) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { kycId, action, notes } = await req.json();

    if (!kycId || !action || !["APPROVE", "REJECT", "FLAG"].includes(action)) {
      return NextResponse.json(
        {
          error:
            "Invalid payload. Requires kycId and action (APPROVE|REJECT|FLAG).",
        },
        { status: 400 },
      );
    }

    const targetStatusMap: Record<string, string> = {
      APPROVE: "APPROVED",
      REJECT: "REJECTED",
      FLAG: "UNDER_REVIEW",
    };

    const targetStatus = targetStatusMap[action];

    const updated = await prisma.kYCRecord.update({
      where: { id: kycId },
      data: {
        status: targetStatus as "APPROVED" | "REJECTED" | "UNDER_REVIEW",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        notes: notes ?? undefined,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `KYC_${action}`,
        entity: "KYCRecord",
        entityId: kycId,
        oldValue: undefined,
        newValue: { status: targetStatus },
        ipAddress: null,
        userAgent: null,
      },
    });

    // Notify the user
    await prisma.notification.create({
      data: {
        userId: updated.userId,
        type: "KYC",
        title: "KYC Status Updated",
        message:
          targetStatus === "APPROVED"
            ? "Your identity verification has been approved. You can now continue investing."
            : targetStatus === "REJECTED"
              ? `Your KYC submission has been rejected. ${notes ? `Reason: ${notes}` : "Please review your documents and try again."}`
              : "Your KYC submission is under review. An analyst is examining your documents.",
        metadata: { status: targetStatus },
      },
    });

    return NextResponse.json(
      { success: true, kycRecord: updated },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to update KYC record" },
      { status: 500 },
    );
  }
}
