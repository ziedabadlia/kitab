import { auth } from "@/features/auth/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Helper function to calculate book priority
function getBookPriority(book: any): number {
  const now = new Date();
  const dueDate = new Date(book.dueDate);
  const isReturned = book.status === "RETURNED";

  // Priority 1: Overdue (highest priority)
  if (!isReturned && (book.status === "OVERDUE" || dueDate < now)) {
    return 1;
  }

  // Priority 2: Due soon (within 3 days)
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (!isReturned && daysUntilDue > 0 && daysUntilDue <= 3) {
    return 2;
  }

  // Priority 3: Active (borrowed, not due soon)
  if (!isReturned) {
    return 3;
  }

  // Priority 4: Returned (lowest priority)
  return 4;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        student: true,
      },
    });

    if (!profile?.student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const borrowedBooks = await db.borrowing.findMany({
      where: { studentId: profile.student.id },
      include: {
        book: {
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    // Sort books by priority, then by borrow date
    const sortedBooks = borrowedBooks.sort((a, b) => {
      const aPriority = getBookPriority(a);
      const bPriority = getBookPriority(b);

      // Sort by priority first
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // If same priority, sort by most recently borrowed
      return (
        new Date(b.borrowedAt).getTime() - new Date(a.borrowedAt).getTime()
      );
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
        categories: b.book.categories.map((c) => ({
          name: c.category.name,
        })),
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
