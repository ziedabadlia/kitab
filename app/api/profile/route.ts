import { auth } from "@/features/auth/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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
      orderBy: { borrowedAt: "desc" },
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
      borrowedBooks: borrowedBooks.map((b) => ({
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
