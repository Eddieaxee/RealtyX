import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with profile, settings, and wallet in a transaction
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          password: hashedPassword,
          role: "USER",
          status: "ACTIVE",
        },
      });

      // Create profile
      await tx.profile.create({
        data: {
          userId: newUser.id,
          firstName: name || email.split("@")[0],
        },
      });

      // Create default settings
      await tx.userSettings.create({
        data: {
          userId: newUser.id,
        },
      });

      // Create wallet
      await tx.wallet.create({
        data: {
          userId: newUser.id,
        },
      });

      return newUser;
    });

    // Send welcome email (non-blocking)
    // Send welcome email (non-blocking). Do not include userId in payload to match EmailPayload type.
    sendEmail({
      to: email,
      subject: "Welcome to RealtyX",
      template: "welcome",
      data: {
        userName: name || email.split("@")[0],
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        redirectTo: "/dashboard",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}