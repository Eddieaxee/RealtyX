import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must accurately reference your legal identification registry."),
  email: z.string().email("A valid transactional communication email path is required."),
  password: z.string().min(6, "Password length must clear minimum security limits."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const normalizedEmail = parsed.data.email.toLowerCase().trim();

    // Structural concurrency verification mapping check
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Identical investor allocation profile already registered." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    // Administrative override tracking configuration context
    const administrativeRole = normalizedEmail === "edisonelvisy@gmail.com" ? "ADMIN" : "USER";

    // Atomically instantiate deep ledger assets to prevent asynchronous structural relation errors
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: administrativeRole,
        status: "ACTIVE",
        // Nested relation creation ensures downstream runtime queries resolve natively instantly
        kyc: {
          create: {
            status: "PENDING",
            firstName: parsed.data.name.split(" ")[0] || "Investor",
            lastName: parsed.data.name.split(" ").slice(1).join(" ") || "Profile",
            nationality: "Nigerian",
            country: "Nigeria",
            state: "Lagos",
            idType: "BVN",
            investmentGoals: [],
          }
        }
      },
      include: {
        kyc: true
      }
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }, { status: 201 });

  } catch (error) {
    console.error("CRITICAL_REGISTRATION_FAULT:", error);
    return NextResponse.json(
      { error: "Internal core infrastructure registration transaction failure." },
      { status: 500 },
    );
  }
}