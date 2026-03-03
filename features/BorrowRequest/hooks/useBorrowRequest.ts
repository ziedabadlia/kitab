"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createBorrowRequest } from "../actions/borrowRequest";

export function useBorrowRequest(bookId: string, hasExistingRequest: boolean) {
  const [isPending, startTransition] = useTransition();
  const [requested, setRequested] = useState(hasExistingRequest);

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
    handleBorrow,
  };
}
