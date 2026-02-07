import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const departments = await db.department.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    return NextResponse.json(departments);
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch", details: String(error) },
      { status: 500 },
    );
  }
}
