import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.userNotificationSettings.findUnique({
    where: { userId: session.user.id },
  });

  if (!settings) {
    const created = await prisma.userNotificationSettings.create({
      data: { userId: session.user.id },
    });
    return NextResponse.json(
      { success: true, settings: created },
      { status: 200 },
    );
  }

  return NextResponse.json({ success: true, settings }, { status: 200 });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      emailDrawdown,
      smsSecondaryMatch,
      marketingUpdates,
      twoFactorEnforced,
    } = await request.json();

    const updatedSettings = await prisma.userNotificationSettings.upsert({
      where: { userId: session.user.id },
      update: {
        emailDrawdown,
        smsSecondaryMatch,
        marketingUpdates,
        twoFactorEnforced,
      },
      create: {
        userId: session.user.id,
        emailDrawdown,
        smsSecondaryMatch,
        marketingUpdates,
        twoFactorEnforced,
      },
    });

    return NextResponse.json(
      { success: true, settings: updatedSettings },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to persist configuration states" },
      { status: 500 },
    );
  }
}
