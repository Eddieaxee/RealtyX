import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/user/settings - Fetch current user settings
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const settings = await db.userSettings.findUnique({
      where: { userId: session.user.id },
    });

    // If no settings exist, create defaults
    if (!settings) {
      const defaults = await db.userSettings.create({
        data: { userId: session.user.id },
      });
      return NextResponse.json({ success: true, settings: defaults });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

/**
 * PATCH /api/user/settings - Update user settings
 */
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const allowedFields = [
      "allowNotifications", "emailAlerts", "soundEffects", "pushNotifications",
      "darkMode", "language", "currency", "timezone", "marketingEmails", "loginAlerts",
    ];

    // Filter to only allowed fields
    const updateData: Record<string, string | number | boolean> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const settings = await db.userSettings.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        ...updateData,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}