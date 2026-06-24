import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Admin KYC Management API
 * - GET: List all KYC submissions (with filtering)
 * - POST: Update KYC status (approve/reject)
 */

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // PENDING | APPROVED | REJECTED | all
    const search = searchParams.get("search")?.toLowerCase();

    const where: Record<string, unknown> = {};

    if (status && status !== "all") {
      where.status = status;
    }

    const kycs = await db.kyc.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            kycStatus: true,
            createdAt: true,
            walletAddress: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Apply search filter if needed
    let filtered = kycs;
    if (search) {
      filtered = kycs.filter(
        (k) =>
          k.firstName?.toLowerCase().includes(search) ||
          k.lastName?.toLowerCase().includes(search) ||
          k.user.name?.toLowerCase().includes(search) ||
          k.user.email?.toLowerCase().includes(search) ||
          k.idNumber?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, kycs: filtered });
  } catch (error) {
    console.error("Failed to fetch KYC submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch KYC data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
  }

  try {
    const { kycId, action, notes } = await req.json();

    if (!kycId || !action) {
      return NextResponse.json(
        { error: "kycId and action (APPROVED/REJECTED) are required" },
        { status: 400 }
      );
    }

    if (action !== "APPROVED" && action !== "REJECTED") {
      return NextResponse.json(
        { error: "Action must be APPROVED or REJECTED" },
        { status: 400 }
      );
    }

    // Fetch the KYC record
    const kyc = await db.kyc.findUnique({
      where: { id: kycId },
      include: { user: true },
    });

    if (!kyc) {
      return NextResponse.json(
        { error: "KYC record not found" },
        { status: 404 }
      );
    }

    // Update the KYC record status
    await db.kyc.update({
      where: { id: kycId },
      data: {
        status: action,
        notes: notes || null,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
    });

    // Update the denormalized kycStatus on the User model
    const userKycStatus = action === "APPROVED" ? "VERIFIED" : "REJECTED";
    await db.user.update({
      where: { id: kyc.userId },
      data: { kycStatus: userKycStatus },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: action === "APPROVED" ? "KYC_APPROVE" : "KYC_REJECT",
        resource: "Kyc",
        resourceId: kycId,
        metadata: JSON.stringify({
          targetUserId: kyc.userId,
          targetUserEmail: kyc.user.email,
          notes,
        }),
      },
    });

    // Create notification for the user
    await db.notification.create({
      data: {
        userId: kyc.userId,
        title: action === "APPROVED" ? "KYC Verification Approved" : "KYC Verification Rejected",
        message:
          action === "APPROVED"
            ? "Your identity verification has been approved. You can now invest in properties and use all platform features."
            : `Your KYC verification was rejected. Reason: ${notes || "Please resubmit with clear documents."}`,
        type: action === "APPROVED" ? "SUCCESS" : "ERROR",
        link: "/kyc",
      },
    });

    // If approved and user has a wallet address, trigger on-chain KYC update
    if (action === "APPROVED" && kyc.user.walletAddress) {
      // Async call - don't block the response
      import("@/lib/blockchain/contract-interactions").then(
        ({ setKYCStatusOnChain }) => {
          setKYCStatusOnChain(
            kyc.user.walletAddress as `0x${string}`,
            true
          ).catch((err) =>
            console.error("Failed to update on-chain KYC:", err)
          );
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: `KYC ${action === "APPROVED" ? "approved" : "rejected"} successfully`,
      data: {
        userId: kyc.userId,
        kycStatus: userKycStatus,
      },
    });
  } catch (error) {
    console.error("Failed to update KYC:", error);
    return NextResponse.json(
      { error: "Failed to update KYC status" },
      { status: 500 }
    );
  }
}