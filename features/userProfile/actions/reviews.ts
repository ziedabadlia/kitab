"use server";

import { db } from "@/lib/db";
import { auth } from "@/features/auth/auth";
import { revalidatePath } from "next/cache";
import { ReviewsData } from "../types";

export type ActionResult =
  | {
      success: true;
      author: { fullName: string; profilePictureUrl: string | null };
    }
  | { error: string };

// ── Fetch all reviews + current user eligibility ──────────────────────────────
export async function getBookReviews(bookId: string): Promise<ReviewsData> {
  const session = await auth();

  // Fetch reviews with author info via borrowing → student → user
  const reviews = await db.review.findMany({
    where: { bookId },
    orderBy: { createdAt: "desc" },
    include: {
      borrowing: {
        include: {
          student: {
            include: {
              user: { select: { fullName: true, profilePictureUrl: true } },
            },
          },
        },
      },
    },
  });

  const totalCount = reviews.length;
  const averageRating =
    totalCount > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount) * 10,
        ) / 10
      : 0;

  const formatted = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
    author: {
      fullName: r.borrowing.student.user.fullName,
      profilePictureUrl: r.borrowing.student.user.profilePictureUrl,
    },
  }));

  // Check current user eligibility
  if (!session?.user?.id) {
    return {
      reviews: formatted,
      totalCount,
      averageRating,
      canReview: false,
      hasReviewed: false,
      returnedBorrowingId: null,
    };
  }

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!student) {
    return {
      reviews: formatted,
      totalCount,
      averageRating,
      canReview: false,
      hasReviewed: false,
      returnedBorrowingId: null,
    };
  }

  // Find a RETURNED borrowing for this book by this student
  const returnedBorrowing = await db.borrowing.findFirst({
    where: { studentId: student.id, bookId, status: "RETURNED" },
    select: { id: true },
  });

  if (!returnedBorrowing) {
    return {
      reviews: formatted,
      totalCount,
      averageRating,
      canReview: false,
      hasReviewed: false,
      returnedBorrowingId: null,
    };
  }

  // Check if they already reviewed via any of their returned borrowings
  const existingReview = await db.review.findFirst({
    where: {
      bookId,
      borrowing: { studentId: student.id },
    },
    select: { id: true },
  });

  return {
    reviews: formatted,
    totalCount,
    averageRating,
    canReview: true,
    hasReviewed: !!existingReview,
    returnedBorrowingId: returnedBorrowing.id,
  };
}

// ── Submit a review ───────────────────────────────────────────────────────────
export async function submitReview(
  bookId: string,
  borrowingId: string,
  rating: number,
  comment: string,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  if (rating < 1 || rating > 5)
    return { error: "Rating must be between 1 and 5." };
  if (!comment.trim()) return { error: "Review content cannot be empty." };

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!student) return { error: "Student record not found." };

  // Verify the borrowing belongs to this student, is for this book, and is RETURNED
  const borrowing = await db.borrowing.findFirst({
    where: {
      id: borrowingId,
      studentId: student.id,
      bookId,
      status: "RETURNED",
    },
  });
  if (!borrowing)
    return { error: "You can only review books you have returned." };

  try {
    await db.review.create({
      data: { borrowingId, bookId, rating, comment: comment.trim() },
    });

    // Recalculate and update book's average rating
    const { _avg } = await db.review.aggregate({
      where: { bookId },
      _avg: { rating: true },
    });

    await db.book.update({
      where: { id: bookId },
      data: { rating: Math.round((_avg.rating ?? 0) * 10) / 10 },
    });

    // Fetch author info to return for optimistic UI update
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { fullName: true, profilePictureUrl: true },
    });

    revalidatePath(`/books/${bookId}`);
    return {
      success: true,
      author: {
        fullName: user?.fullName ?? "Unknown",
        profilePictureUrl: user?.profilePictureUrl ?? null,
      },
    };
  } catch (e: any) {
    if (e?.code === "P2002")
      return { error: "You have already reviewed this book." };
    return { error: "Failed to submit review." };
  }
}
