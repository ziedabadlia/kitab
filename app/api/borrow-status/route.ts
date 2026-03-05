import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/features/auth/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ hasRequest: false });

  const bookId = req.nextUrl.searchParams.get("bookId");
  if (!bookId) return NextResponse.json({ hasRequest: false });

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!student) return NextResponse.json({ hasRequest: false });

  const existing = await db.borrowing.findFirst({
    where: {
      studentId: student.id,
      bookId,
      status: { notIn: ["RETURNED", "REJECTED", "CANCELLED", "LOST"] },
    },
    select: { id: true },
  });

  return NextResponse.json({ hasRequest: !!existing });
}
