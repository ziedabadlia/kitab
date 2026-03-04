import { useState } from "react";
import { BorrowingStatus } from "@prisma/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { updateBorrowingStatus } from "../actions/borrowing";
import { getStatusStyles } from "../utils/status";

export interface RowRequest {
  id: string;
  status: BorrowingStatus;
  borrowedAt: string | null;
  returnedAt: string | null;
  dueDate: string | null;
  requestedAt: string;
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

const BORROW_PERIOD_DAYS = 9;

function fmt(date: Date): string {
  return format(date, "MMM dd, yyyy");
}

export function useBorrowRequestRow(request: RowRequest) {
  const [status, setStatus] = useState<BorrowingStatus>(request.status);
  const [borrowedAt, setBorrowedAt] = useState<string | null>(
    request.borrowedAt,
  );
  const [dueDate, setDueDate] = useState<string | null>(request.dueDate);
  const [returnedAt, setReturnedAt] = useState<string | null>(
    request.returnedAt,
  );
  const [rawDueDate, setRawDueDate] = useState<string | null>(
    request.rawDueDate,
  );
  const [rawReturnedAt, setRawReturnedAt] = useState<string | null>(
    request.rawReturnedAt,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const isTerminal = ["RETURNED", "REJECTED", "CANCELLED", "LOST"].includes(
    status,
  );

  const isOverdue =
    status === "BORROWED" && !!rawDueDate && new Date(rawDueDate) < new Date();

  const isLateReturn =
    status === "RETURNED" &&
    !!rawReturnedAt &&
    !!rawDueDate &&
    new Date(rawReturnedAt) > new Date(rawDueDate);

  const statusStyles = getStatusStyles(status, isLateReturn || false);

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
      const result = await updateBorrowingStatus(request.id, newStatus);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      // Optimistically update dates to match what the server just wrote
      if (newStatus === "BORROWED") {
        const now = new Date();
        const due = new Date(now);
        due.setDate(due.getDate() + BORROW_PERIOD_DAYS);
        setBorrowedAt(fmt(now));
        setDueDate(fmt(due));
        setRawDueDate(due.toISOString());
      }

      if (newStatus === "RETURNED") {
        const now = new Date();
        setReturnedAt(fmt(now));
        setRawReturnedAt(now.toISOString());
      }

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
    borrowedAt,
    dueDate,
    returnedAt,
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
