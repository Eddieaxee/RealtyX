import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    const detail = searchParams.get("detail");

    // If requesting specific user details
    if (userId && detail === "true") {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          _count: { select: { investments: true } },
          kyc: {
            select: {
              status: true,
              firstName: true,
              lastName: true,
              idType: true,
              country: true,
            },
          },
          wallet: {
            select: {
              balanceUSD: true,
              totalInvested: true,
              totalReturns: true,
            },
          },
          investments: {
            take: 10,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              amountUSD: true,
              tokens: true,
              createdAt: true,
              property: {
                select: { title: true, priceUSD: true },
              },
            },
          },
          settings: {
            select: {
              allowNotifications: true,
              emailAlerts: true,
              twoFactorEnabled: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }

      // Transform wallet data to match expected interface
      const transformedUser = {
        ...user,
        wallet: user.wallet ? {
          balance: user.wallet.balanceUSD,
          totalInvested: user.wallet.totalInvested,
          totalReturns: user.wallet.totalReturns,
        } : { balance: 0, totalInvested: 0, totalReturns: 0 },
        investments: user.investments.map(i => ({
          id: i.id,
          amount: i.amountUSD,
          tokens: i.tokens,
          createdAt: i.createdAt.toISOString(),
          property: i.property,
        })),
      };

      return NextResponse.json({ success: true, user: transformedUser });
    }

    // Return all users with basic stats
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { investments: true } },
        kyc: { select: { status: true } },
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, role, status } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const updateData: Record<string, string> = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const user = await db.user.update({
      where: { id },
      data: updateData,
    });

    // Log audit
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: role ? "USER_ROLE_CHANGE" : "USER_STATUS_CHANGE",
        resource: "User",
        resourceId: id,
        metadata: JSON.stringify(updateData),
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}