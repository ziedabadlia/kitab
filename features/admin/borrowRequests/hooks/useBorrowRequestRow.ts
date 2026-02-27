import { useState } from "react";
import { BorrowingStatus } from "@prisma/client";
import { toast } from "sonner";
import { updateBorrowingStatus } from "../actions/borrowing";
import { getStatusStyles } from "../utils/status";

export interface RowRequest {
  id: string;
  status: BorrowingStatus;
  borrowedAt: string | null;
  returnedAt: string | null;
  dueDate: string | null;
  requestedAt: string;
  // Raw ISO strings for reliable date comparisons (not formatted display strings)
  rawDueDate: string | null;
  rawReturnedAt: string | null;
  book: {
    title: string;
    coverImageUrl: string;
    coverColor: string;
  };
  student: {
    fullName: string;
    profilePictureUrl: string | null;
  };
}

export function useBorrowRequestRow(request: RowRequest) {
  const [status, setStatus] = useState<BorrowingStatus>(request.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const isTerminal = ["RETURNED", "REJECTED", "CANCELLED", "LOST"].includes(
    status,
  );

  // Use raw ISO strings for date comparisons — formatted strings like "Jan 01, 2025"
  // are locale-dependent and will produce wrong results with new Date()
  const isOverdue =
    status === "BORROWED" &&
    !!request.rawDueDate &&
    new Date(request.rawDueDate) < new Date();

  const isLateReturn =
    status === "RETURNED" &&
    !!request.rawReturnedAt &&
    !!request.rawDueDate &&
    new Date(request.rawReturnedAt) > new Date(request.rawDueDate);

  const statusStyles = getStatusStyles(status, isLateReturn || false);

  // Options depend on current status + whether the book is overdue:
  //
  // PENDING   → Accept | Reject | Cancel
  // ACCEPTED  → Mark Borrowed | Cancel
  // BORROWED  → within due date: Return only
  //             past due date:   Late Return only (same RETURNED value, different label)
  // terminal  → no options (select is hidden, badge shown instead)
  const statusOptions = (() => {
    if (status === "PENDING") {
      return [
        { value: "ACCEPTED", label: "Accept" },
        { value: "REJECTED", label: "Reject" },
        { value: "CANCELLED", label: "Cancel" },
      ];
    }
    if (status === "ACCEPTED") {
      return [
        { value: "BORROWED", label: "Mark Borrowed" },
        { value: "CANCELLED", label: "Cancel" },
      ];
    }
    if (status === "BORROWED") {
      return isOverdue
        ? [{ value: "RETURNED", label: "Late Return" }]
        : [{ value: "RETURNED", label: "Return" }];
    }
    return [];
  })();

  const handleStatusChange = async (newStatus: BorrowingStatus) => {
    try {
      setIsUpdating(true);
      await updateBorrowingStatus(request.id, newStatus);
      setStatus(newStatus);
      toast.success("Status updated successfully");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const canGenerateReceipt = status === "RETURNED" || status === "BORROWED";

  return {
    status,
    isUpdating,
    isTerminal,
    isOverdue,
    isLateReturn,
    statusStyles,
    statusOptions,
    isReceiptOpen,
    setIsReceiptOpen,
    handleStatusChange,
    canGenerateReceipt,
  };
}
