import { useMemo } from "react";
import { BorrowedBook } from "../types";

export interface BookCardFormattingResult {
  borrowDate: string;
  categories: string;
}

export const useBookCardFormatting = (
  book: BorrowedBook,
): BookCardFormattingResult => {
  const borrowDate = useMemo(
    () =>
      new Date(book.borrowedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    [book.borrowedAt],
  );

  const categories = useMemo(
    () => book.categories.map((item: any) => item.name).join(" / "),
    [book.categories],
  );

  return { borrowDate, categories };
};
