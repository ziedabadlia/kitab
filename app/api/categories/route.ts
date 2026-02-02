import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 API: Fetching categories...");
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });

    console.log("✅ API: Found", categories.length, "categories");
    return NextResponse.json(categories);
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch", details: String(error) },
      { status: 500 },
    );
  }
}
