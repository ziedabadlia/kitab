import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/features/auth/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/features/admin/borrowRequests/constants";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const borrowing = await db.borrowing.findUnique({
    where: { id },
    include: {
      book: { include: { categories: { include: { category: true } } } },
      student: { include: { user: true } },
    },
  });

  if (!borrowing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: borrowing.id,
    status: borrowing.status,
    borrowedAt: formatDate(borrowing.borrowedAt),
    returnedAt: formatDate(borrowing.returnedAt),
    dueDate: formatDate(borrowing.dueDate),
    requestedAt:
      formatDate(borrowing.createdAt) ?? borrowing.createdAt.toISOString(),
    rawBorrowedAt: borrowing.borrowedAt?.toISOString() ?? null,
    rawReturnedAt: borrowing.returnedAt?.toISOString() ?? null,
    rawDueDate: borrowing.dueDate?.toISOString() ?? null,
    rawCreatedAt: borrowing.createdAt.toISOString(),
    book: {
      id: borrowing.book.id,
      title: borrowing.book.title,
      author: borrowing.book.author,
      genre:
        borrowing.book.categories.map((c) => c.category.name).join(", ") ||
        null,
      coverImageUrl: borrowing.book.coverImageUrl ?? "",
      coverColor: borrowing.book.coverColor,
    },
    student: {
      fullName: borrowing.student.user.fullName,
      email: borrowing.student.user.email,
      profilePictureUrl: borrowing.student.user.profilePictureUrl,
    },
  });
}
