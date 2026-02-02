import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [departments, categories] = await Promise.all([
    db.department.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return NextResponse.json({ departments, categories });
}
