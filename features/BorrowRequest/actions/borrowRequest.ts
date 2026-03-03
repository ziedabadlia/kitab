"use server";

import { auth } from "@/features/auth/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type BorrowRequestResult = { success: true } | { error: string };

export async function createBorrowRequest(
  bookId: string,
): Promise<BorrowRequestResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to borrow a book." };
  }

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true, status: true },
  });

  if (!student) {
    return { error: "Student record not found." };
  }

  if (student.status !== "ACCEPTED") {
    return { error: "Your account must be approved before borrowing books." };
  }

  // Check if an active request already exists for this book
  const existing = await db.borrowing.findFirst({
    where: {
      studentId: student.id,
      bookId,
      status: { notIn: ["RETURNED", "REJECTED", "CANCELLED", "LOST"] },
    },
  });

  if (existing) {
    return { error: "You already have an active request for this book." };
  }

  // Check availability
  const book = await db.book.findUnique({
    where: { id: bookId },
    select: { availableCopies: true, title: true },
  });

  if (!book) {
    return { error: "Book not found." };
  }

  if (book.availableCopies < 1) {
    return { error: "No copies available at the moment." };
  }

  await db.borrowing.create({
    data: {
      studentId: student.id,
      bookId,
      status: "PENDING",
      borrowedAt: null,
      dueDate: null,
      returnedAt: null,
    },
  });

  revalidatePath(`/books`);

  return { success: true };
}
