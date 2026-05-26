import { NextResponse } from "next/server";
import {
  verifyWalletSignature,
  verifyTypedDataSignature,
} from "@/lib/blockchain/verify";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { message, signature, address, type, domain, types, value } =
      await req.json();

    let isValid = false;
    if (type === "typed") {
      isValid = await verifyTypedDataSignature(
        domain,
        types,
        value,
        signature,
        address,
      );
    } else {
      isValid = await verifyWalletSignature(message, signature, address);
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Link wallet to user or create nonce for auth
    const wallet = await prisma.wallet.upsert({
      where: { address: address.toLowerCase() },
      update: { isVerified: true, verifiedAt: new Date() },
      create: {
        address: address.toLowerCase(),
        chainId: 1,
        chain: "ethereum",
        type: "EOA",
        isVerified: true,
        verifiedAt: new Date(),
        userId: "", // Will be linked after auth
      },
    });

    return NextResponse.json({ success: true, wallet });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
