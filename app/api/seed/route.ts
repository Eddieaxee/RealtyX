import { NextResponse } from "next/server";
import propertiesData from "@/data/properties.json";

export async function GET() {
  try {
    const count = (propertiesData as unknown[]).length;
    return NextResponse.json({
      success: true,
      message: `Seed data available with ${count} properties`,
      count,
      properties: propertiesData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load seed data" },
      { status: 500 }
    );
  }
}