import { auth } from "@/features/auth/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { Borrowing } from "@prisma/client";

function getBookPriority(book: Borrowing): number {
  const now = new Date();
  if (book.status === "RETURNED") return 4;
  if (!book.dueDate) return 3;
  const dueDate = new Date(book.dueDate);
  if (book.status === "OVERDUE" || dueDate < now) return 1;
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysUntilDue > 0 && daysUntilDue <= 3) return 2;
  return 3;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch profile and borrowings in a single query instead of two sequential ones
    const profile = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        student: {
          include: {
            borrowings: {
              include: {
                book: {
                  include: {
                    categories: { include: { category: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!profile?.student)
      return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const sortedBooks = [...profile.student.borrowings].sort((a, b) => {
      const priorityDiff = getBookPriority(a) - getBookPriority(b);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      profile: {
        id: profile.id,
        studentId: profile.student.id,
        fullName: profile.fullName,
        email: profile.email,
        profilePictureUrl: profile.profilePictureUrl,
        studentIdNumber: profile.student.studentIdNumber,
        universityName: profile.student.universityName,
        status: profile.student.status,
        generatedIdCardUrl: profile.student.generatedIdCardUrl,
        dateOfBirth: profile.student.dateOfBirth,
        department: profile.student.department,
        contactNo: profile.student.contactNo,
        address: profile.student.address,
      },
      borrowedBooks: sortedBooks.map((b) => ({
        id: b.id,
        title: b.book.title,
        author: b.book.author,
        coverImageUrl: b.book.coverImageUrl,
        coverColor: b.book.coverColor,
        categories: b.book.categories.map((c) => ({ name: c.category.name })),
        requestedAt: b.createdAt,
        borrowedAt: b.borrowedAt,
        dueDate: b.dueDate,
        returnedAt: b.returnedAt,
        status: b.status,
      })),
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
