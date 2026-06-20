import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { broadcastPropertyCreation } from "@/lib/email";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const properties = await db.property.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { investments: true } },
      },
    });

    return NextResponse.json({ success: true, properties });
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title, description, slug, type, status, developmentStatus, completionPercentage,
      location, city, state, country, region, lat, lng,
      priceUSD, priceNGN, totalTokens, availableTokens, tokenPriceUSD, tokenPriceNGN,
      expectedReturn, rentalYield,
      images, features, documents,
      occupancyRate, maintenanceCosts, netOperatingIncome, appreciationRate,
      spvName, spvRegistration, deedTitleRef,
    } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    const propertySlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const property = await db.property.create({
      data: {
        title,
        description: description || "",
        slug: propertySlug,
        type: type || "RESIDENTIAL",
        status: status || "AVAILABLE",
        developmentStatus: developmentStatus || "COMPLETED",
        completionPercentage: completionPercentage || 0,
        location: location || "",
        city: city || "",
        state: state || "",
        country: country || "Nigeria",
        region: region || "",
        lat: lat || null,
        lng: lng || null,
        priceUSD: priceUSD || 0,
        priceNGN: priceNGN || 0,
        totalTokens: totalTokens || 0,
        availableTokens: availableTokens || 0,
        tokenPriceUSD: tokenPriceUSD || 0,
        tokenPriceNGN: tokenPriceNGN || 0,
        expectedReturn: expectedReturn || null,
        rentalYield: rentalYield || null,
        images: images ? JSON.stringify(images) : "[]",
        features: features ? JSON.stringify(features) : "[]",
        documents: documents ? JSON.stringify(documents) : "[]",
        occupancyRate: occupancyRate || 0,
        maintenanceCosts: maintenanceCosts || 0,
        netOperatingIncome: netOperatingIncome || 0,
        appreciationRate: appreciationRate || 0,
        spvName: spvName || null,
        spvRegistration: spvRegistration || null,
        deedTitleRef: deedTitleRef || null,
      },
    });

    // Log audit trail
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "PROPERTY_CREATE",
        resource: "Property",
        resourceId: property.id,
        metadata: JSON.stringify({ title: property.title, slug: property.slug }),
      },
    });

    // Broadcast notification to all users in background (non-blocking)
    broadcastPropertyCreation(property.title, property.id).catch((err) => {
      console.error("[NOTIFICATION] Broadcast failed:", err);
    });

    return NextResponse.json({ success: true, property });
  } catch (error) {
    console.error("Failed to create property:", error);
    return NextResponse.json({ success: false, error: "Failed to create property" }, { status: 500 });
  }
}