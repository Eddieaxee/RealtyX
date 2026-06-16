import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// In-memory settings store (would be database in production)
const settingsStore = new Map<string, Record<string, unknown>>();

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = settingsStore.get(session.user.id) || {
      emailDrawdown: true,
      smsSecondaryMatch: false,
      marketingUpdates: true,
      twoFactorEnforced: true,
    };

    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    settingsStore.set(session.user.id, body);

    return NextResponse.json({ success: true, settings: body });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}