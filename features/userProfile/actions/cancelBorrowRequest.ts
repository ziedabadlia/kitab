"use server";

import { db } from "@/lib/db";
import { auth } from "@/features/auth/auth";
import { revalidatePath } from "next/cache";

export type CancelRequestResult = { success: true } | { error: string };

export async function cancelBorrowRequest(
  borrowingId: string,
): Promise<CancelRequestResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!student) return { error: "Student record not found." };

  // Only allow cancelling own PENDING requests
  const result = await db.borrowing.updateMany({
    where: {
      id: borrowingId,
      studentId: student.id,
      status: "PENDING",
    },
    data: { status: "CANCELLED" },
  });

  if (result.count === 0) {
    return { error: "Request not found or no longer cancellable." };
  }

  revalidatePath("/profile");
  return { success: true };
}
