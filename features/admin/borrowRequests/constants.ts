import { BorrowingStatus } from "@prisma/client";

export const TERMINAL_STATES: BorrowingStatus[] = [
  "RETURNED",
  "REJECTED",
  "CANCELLED",
  "LOST",
];

export const formatDate = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};
