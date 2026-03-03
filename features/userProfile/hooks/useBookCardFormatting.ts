import { useMemo } from "react";
import { format } from "date-fns";
import { BorrowedBook } from "../types";

export interface BookCardFormattingResult {
  borrowDate: string;
  requestedDate: string;
  categories: string;
}

export const useBookCardFormatting = (
  book: BorrowedBook,
): BookCardFormattingResult => {
  const borrowDate = useMemo(
    () =>
      book.borrowedAt ? format(new Date(book.borrowedAt), "MMM d, yyyy") : "—",
    [book.borrowedAt],
  );

  const requestedDate = useMemo(
    () => format(new Date(book.requestedAt), "MMM d, yyyy"),
    [book.requestedAt],
  );

  const categories = useMemo(
    () => book.categories.map((item) => item.name).join(" / "),
    [book.categories],
  );

  return { borrowDate, requestedDate, categories };
};
