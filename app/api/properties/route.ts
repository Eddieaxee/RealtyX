import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import propertiesData from "@/data/properties.json";

// In-memory store for new properties (would be database in production)
const additionalProperties: typeof propertiesData = [];

export async function GET() {
  try {
    const allProperties = [...propertiesData, ...additionalProperties];
    return NextResponse.json({ properties: allProperties });
  } catch {
    return NextResponse.json({ error: "Failed to load properties" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Create new property with defaults
    const newProperty = {
      id: body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      slug: body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      title: body.title,
      description: body.description || "",
      location: body.location || "",
      city: body.city || "",
      state: body.state || "",
      region: body.region || "OTHER",
      country: "Nigeria",
      category: body.category || "RESIDENTIAL",
      lifecycle: body.lifecycle || "UNDER_CONSTRUCTION",
      currentMilestone: "Just Listed",
      lat: body.lat || 6.5244,
      lng: body.lng || 3.3792,
      image: body.image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      images: body.image ? [body.image] : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"],
      tokenPriceUSD: body.tokenPriceUSD || Math.min(body.tokenPriceNGN ? Math.round(body.tokenPriceNGN / 600) : 50, 100),
      tokenPriceNGN: body.tokenPriceNGN || 30000,
      totalValueNGN: body.totalValueNGN || 1000000000,
      totalValueUSD: body.totalValueUSD || Math.round((body.totalValueNGN || 1000000000) / 600),
      expectedReturn: body.expectedReturn || 15,
      rentalYield: body.rentalYield || 8,
      availableTokens: body.availableTokens || 20000,
      totalTokens: body.totalTokens || 20000,
      funded: body.funded || 0,
      completionPercentage: body.completionPercentage || 0,
      features: body.features || ["New Development"],
      documents: body.documents || ["Title Deed - Pending"],
      neighborhoodInsights: body.neighborhoodInsights || {
        walkScore: 70,
        safetyIndex: "Standard",
        transitAccess: "Good",
        infrastructure: [],
      },
    };

    additionalProperties.push(newProperty);

    return NextResponse.json({ success: true, property: newProperty });
  } catch (error) {
    console.error("Failed to create property:", error);
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}