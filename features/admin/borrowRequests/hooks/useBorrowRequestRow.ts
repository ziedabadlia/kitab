import { useState } from "react";
import { BorrowingStatus } from "@prisma/client";
import { toast } from "sonner";
import { updateBorrowingStatus } from "../actions/borrowing";
import { getStatusStyles } from "../utils/status";

// Define strict type for the request object used in the row
export interface RowRequest {
  id: string;
  status: BorrowingStatus;
  borrowedAt: string | null;
  returnedAt: string | null;
  dueDate: string | null;
  requestedAt: string;
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

  // Statuses where no further action can be taken
  const isTerminal = ["RETURNED", "REJECTED", "CANCELLED", "LOST"].includes(
    status,
  );

  const isLateReturn =
    status === "RETURNED" &&
    request.returnedAt &&
    request.dueDate &&
    new Date(request.returnedAt) > new Date(request.dueDate);

  const statusStyles = getStatusStyles(status, isLateReturn || false);

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
    { value: "BORROWED", label: "Borrowed" },
    { value: "RETURNED", label: "Returned" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "LOST", label: "Lost" },
  ];

  const handleStatusChange = async (newStatus: BorrowingStatus) => {
    try {
      setIsUpdating(true);
      await updateBorrowingStatus(request.id, newStatus);
      setStatus(newStatus);
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      // Revert status on error if needed, though strictly we haven't changed the prop
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if we can generate a receipt (must be returned or in a specific state)
  const canGenerateReceipt = !!(request.returnedAt || status === "RETURNED");

  return {
    status,
    isUpdating,
    isTerminal,
    isLateReturn,
    statusStyles,
    statusOptions,
    isReceiptOpen,
    setIsReceiptOpen,
    handleStatusChange,
    canGenerateReceipt,
  };
}
