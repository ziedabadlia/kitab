"use client";

import { useState, useTransition, useCallback } from "react";
import { toast } from "sonner";
import { submitReview } from "../actions/reviews";
import { ReviewsData, ReviewItem } from "../types";

export function useReviews(bookId: string, initialData: ReviewsData) {
  const [data, setData] = useState<ReviewsData>(initialData);
  const [isPending, startTransition] = useTransition();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!data.returnedBorrowingId) return;
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    startTransition(async () => {
      const result = await submitReview(
        bookId,
        data.returnedBorrowingId!,
        rating,
        comment,
      );

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      toast.success("Review submitted!");

      // Build the optimistic review entry so UI updates instantly
      const newReview: ReviewItem = {
        id: crypto.randomUUID(),
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        author: result.author,
      };

      setData((prev) => {
        const updatedReviews = [newReview, ...prev.reviews];
        const newTotal = updatedReviews.length;
        const newAvg =
          Math.round(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / newTotal) *
              10,
          ) / 10;

        return {
          ...prev,
          reviews: updatedReviews,
          totalCount: newTotal,
          averageRating: newAvg,
          hasReviewed: true,
        };
      });

      setComment("");
      setRating(0);
      setShowForm(false);
    });
  }, [bookId, data.returnedBorrowingId, rating, comment]);

  return {
    data,
    isPending,
    rating,
    comment,
    showForm,
    setRating,
    setComment,
    setShowForm,
    handleSubmit,
  };
}
