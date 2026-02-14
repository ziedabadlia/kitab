"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
  const where = search
    ? {
        OR: [
          {
            user: {
              fullName: { contains: search, mode: "insensitive" as const },
            },
          },
          {
            user: { email: { contains: search, mode: "insensitive" as const } },
          },
          {
            studentIdNumber: { contains: search, mode: "insensitive" as const },
          },
        ],
      }
    : {};

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
  }));

  return { users, totalPages: Math.ceil(totalStudents / pageSize) };
}

export async function deleteUserAction(userId: string, email: string) {
  try {
    await db.user.delete({
      where: { id: userId },
    });

    // Send Email Logic
    console.log(`Sending account deletion email to ${email}...`);
    // await sendEmail({ to: email, subject: "Account Deleted", body: "..." });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { error: "Failed to delete user" };
  }
}
