import { useMemo } from "react";
import { formatBorrowStatus } from "../lib/utils/borrowStatus";

export function useBookStatus(
  status: string,
  dueDate: Date | string,
  returnedAt?: Date | string | null,
) {
  return useMemo(() => {
    const statusLabel = formatBorrowStatus(status, dueDate, returnedAt);
    const isReturned = status === "RETURNED";
    const isOverdue =
      (new Date(dueDate) < new Date() && !isReturned) || status === "OVERDUE";
    const isWarning = statusLabel.includes("days left");
    const isOnTime = statusLabel === "On Time";

    const themeClass = isOverdue
      ? "bg-red-500/10 border-red-500/20 text-red-400"
      : isWarning
        ? "bg-[#E7C9A5]/10 border-[#E7C9A5]/20 text-[#E7C9A5]"
        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";

    const dotClass = isOverdue
      ? "bg-red-500 shadow-red-500/50"
      : isWarning
        ? "bg-[#E7C9A5] shadow-[#E7C9A5]/50"
        : "bg-emerald-500 shadow-emerald-500/50";

    return {
      statusLabel,
      isReturned,
      isOverdue,
      isWarning,
      isOnTime,
      themeClass,
      dotClass,
    };
  }, [status, dueDate, returnedAt]);
}
