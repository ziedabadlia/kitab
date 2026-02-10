import { BorrowedBook } from "../../types";
import { formatBorrowStatus } from "./borrowStatus";

export const getBookStatusTheme = (book: BorrowedBook) => {
  const statusLabel = formatBorrowStatus(
    book.status,
    book.dueDate,
    book.returnedAt,
  );

  const isReturned = book.status === "RETURNED";
  const isOverdue =
    (new Date(book.dueDate) < new Date() && !isReturned) ||
    book.status === "OVERDUE";

  const isWarning = statusLabel.includes("days left");
  const isOnTime = statusLabel === "On Time";

  return {
    statusLabel,
    isOverdue,
    isOnTime,
    themeClass: isOverdue
      ? "bg-red-500/10 border-red-500/20 text-red-400"
      : isWarning
        ? "bg-[#E7C9A5]/10 border-[#E7C9A5]/20 text-[#E7C9A5]"
        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    dotClass: isOverdue
      ? "bg-red-500 shadow-red-500/50"
      : isWarning
        ? "bg-[#E7C9A5] shadow-[#E7C9A5]/50"
        : "bg-emerald-500 shadow-emerald-500/50",
  };
};
