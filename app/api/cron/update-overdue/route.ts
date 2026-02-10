import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Security check for Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. Update the status to OVERDUE for all active borrowings past due
    const result = await db.borrowing.updateMany({
      where: {
        status: "ACTIVE",
        dueDate: { lt: new Date() },
      },
      data: { status: "OVERDUE" },
    });

    // 2. Optional: Logic for email notifications could go here [cite: 2026-01-21]

    return NextResponse.json({
      success: true,
      updatedCount: result.count,
    });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
