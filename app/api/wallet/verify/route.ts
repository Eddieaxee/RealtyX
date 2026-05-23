import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyMessage, recoverMessageAddress } from "viem";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message, signature, address } = await req.json();
    if (!message || !signature || !address) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const recoveredAddress = await recoverMessageAddress({
      message,
      signature: signature as `0x${string}`,
    });

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: "Address mismatch" }, { status: 400 });
    }

    const wallet = await prisma.wallet.updateMany({
      where: { userId: session.user.id, address: address.toLowerCase() },
      data: { isVerified: true, verifiedAt: new Date() },
    });

    return NextResponse.json({ success: true, verified: true, address: recoveredAddress, walletCount: wallet.count });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
