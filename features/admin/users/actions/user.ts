"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { User } from "../types/users";

export async function getUsersAction({
  page = 1,
  search = "",
  pageSize = 10,
}: {
  page?: number;
  search?: string;
  pageSize?: number;
}) {
  const skip = (page - 1) * pageSize;

  const where = {
    // Only show approved members — suspended students are applicants, not users
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

  const [totalStudents, students] = await Promise.all([
    db.student.count({ where }),
    db.student.findMany({
      where,
      include: { user: true, borrowings: true },
      orderBy: { user: { createdAt: "desc" } },
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
  })) as User[];

  return { users, totalPages: Math.ceil(totalStudents / pageSize) };
}

export async function deleteUserAction(userId: string, email: string) {
  try {
    // Delete notifications first — no cascade on studentId FK
    const student = await db.student.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (student) {
      await db.notification.deleteMany({ where: { studentId: student.id } });
    }

    await db.user.delete({ where: { id: userId } }); // cascades to Student

    console.log(`Sending account deletion email to ${email}...`);

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "Failed to delete user" };
  }
}
