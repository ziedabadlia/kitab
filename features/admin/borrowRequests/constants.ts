import { BorrowingStatus } from "@prisma/client";
import { format } from "date-fns";

export const TERMINAL_STATES: BorrowingStatus[] = [
  "RETURNED",
  "REJECTED",
  "CANCELLED",
  "LOST",
];

export const formatDate = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  return format(date, "MMM dd, yyyy");
};
