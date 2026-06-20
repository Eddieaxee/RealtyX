import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      include: {
        profile: true,
        kyc: true,
        settings: true,
        wallet: true,
      },
    });

    // If no user exists, redirect to registration
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "No account found with this email. Please create an account.",
        redirectTo: "/auth/register",
        code: "NO_USER_FOUND",
      });
    }

    // Verify password
    if (!user.password) {
      return NextResponse.json({
        success: false,
        error: "This account uses social login. Please sign in with Google.",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Check account status
    if (user.status === "SUSPENDED") {
      return NextResponse.json({
        success: false,
        error: "Your account has been suspended. Please contact support.",
      });
    }

    if (user.status === "BANNED") {
      return NextResponse.json({
        success: false,
        error: "Your account has been permanently banned.",
      });
    }

    // Deterministic redirect based on role
    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
    const redirectUrl = isAdmin ? "/admin" : "/dashboard";

    // Log successful login
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        resource: "User",
        resourceId: user.id,
        metadata: JSON.stringify({ role: user.role, redirectTo: redirectUrl }),
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        twoFactorEnabled: user.twoFactorEnabled,
        hasKyc: !!user.kyc,
        hasProfile: !!user.profile,
        hasWallet: !!user.wallet,
        redirectTo: redirectUrl,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}