import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, method } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Return success even if user doesn't exist (prevents enumeration)
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, recovery instructions have been dispatched.",
      });
    }

    // Generate a secure recovery token
    const token = nanoid(48);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store the token in a verification record
    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token,
        expires,
      },
    });

    // TODO: Send email/SMS based on method
    // For now, log the token for development
    if (process.env.NODE_ENV === "development") {
      console.log(`[PASSWORD RESET] Token for ${normalizedEmail}: ${token}`);
      console.log(`[PASSWORD RESET] Reset URL: /auth/reset?token=${token}`);
      console.log(`[PASSWORD RESET] Method: ${method}`);
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, recovery instructions have been dispatched.",
    });
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { error: "Unable to process recovery request. Please try again later." },
      { status: 500 }
    );
  }
}