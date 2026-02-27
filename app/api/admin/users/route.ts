// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export type UserSortField = "fullName" | "createdAt" | "booksBorrowed";
export type SortDirection = "asc" | "desc";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const search = searchParams.get("search") ?? "";
  const sortField = (searchParams.get("sort") ?? "createdAt") as UserSortField;
  const sortDirection = (searchParams.get("dir") ?? "desc") as SortDirection;
  const skip = (page - 1) * pageSize;

  // only include accepted library members (suspended students are not users)
  const where = {
    status: "ACCEPTED" as const,
    ...(search
      ? {
          OR: [
            {
              user: {
                fullName: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              user: {
                email: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              studentIdNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  // Build orderBy based on sort field
  // booksBorrowed requires a count sort via _count relation
  const orderBy =
    sortField === "booksBorrowed"
      ? { borrowings: { _count: sortDirection } }
      : sortField === "fullName"
        ? { user: { fullName: sortDirection } }
        : { user: { createdAt: sortDirection } };

  const [totalStudents, students] = await Promise.all([
    db.student.count({ where }),
    db.student.findMany({
      where,
      include: { user: true, borrowings: true },
      orderBy,
      skip,
      take: pageSize,
    }),
  ]);

  const users = students.map((record) => ({
    id: record.user.id,
    name: record.user.fullName,
    email: record.user.email,
    image: record.user.profilePictureUrl,
    dateJoined: record.user.createdAt
      .toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .replace(",", ""),
    booksBorrowed: record.borrowings.length,
    universityId: record.studentIdNumber,
    universityCard: record.universityIdCardUrl,
  }));

  return NextResponse.json({
    users,
    totalPages: Math.ceil(totalStudents / pageSize),
    totalUsers: totalStudents,
  });
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, email } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }
    // Notification has no cascade from Student, so manually delete
    // child records before deleting the user to avoid FK constraint errors.
    const student = await db.student.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (student) {
      await db.notification.deleteMany({ where: { studentId: student.id } });
    }
    await db.user.delete({ where: { id: userId } }); // cascades to Student
    console.log(`Sending account deletion email to ${email}...`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
