import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }
    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
        role: "USER",
        status: "ACTIVE",
      },
    });
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}
