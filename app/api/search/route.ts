import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    type SearchResult = Record<string, unknown> & { type: string };

    let results: SearchResult[] = [];

    if (type === "properties" || type === "all") {
      const properties = await prisma.property.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { country: { contains: query, mode: "insensitive" } },
          ],
          status: "ACTIVE",
        },
        take: 10,
      });
      results = [
        ...results,
        ...properties.map((p) => ({ ...p, type: "property" })),
      ];
    }

    return NextResponse.json({ results, query });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
