"use client";

import { useState, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { createBorrowRequest } from "../actions/borrowRequest";

export function useBorrowRequest(bookId: string) {
  const [isPending, startTransition] = useTransition();
  const [requested, setRequested] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Fetch borrow status client-side so the page can be ISR cached
  useEffect(() => {
    fetch(`/api/borrow-status?bookId=${bookId}`)
      .then((res) => res.json())
      .then(({ hasRequest }) => setRequested(hasRequest))
      .catch(() => {}) // silently fail — button defaults to enabled
      .finally(() => setIsCheckingStatus(false));
  }, [bookId]);

  const handleBorrow = () => {
    startTransition(async () => {
      const result = await createBorrowRequest(bookId);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setRequested(true);
        toast.success("Borrow request submitted successfully!");
      }
    });
  };

  return {
    requested,
    isPending,
    isCheckingStatus,
    handleBorrow,
  };
}
