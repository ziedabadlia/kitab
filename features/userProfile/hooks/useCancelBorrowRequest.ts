"use client";

import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cancelBorrowRequest } from "../actions/cancelBorrowRequest";

export function useCancelBorrowRequest() {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleCancel = (borrowingId: string) => {
    startTransition(async () => {
      const result = await cancelBorrowRequest(borrowingId);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Borrow request cancelled.");
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    });
  };

  return { isPending, handleCancel };
}
