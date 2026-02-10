import { useMemo, useCallback, useState } from "react";
import { BorrowedBook } from "../types";

export interface UseBorrowedBooksLogicResult {
  isEmpty: boolean;
  selectedReceiptBook: BorrowedBook | null; // New state
  handleReceiptClick: (bookId: string) => void;
  handleCloseModal: () => void; // New handler
}

export const useBorrowedBooksLogic = (
  books: BorrowedBook[],
): UseBorrowedBooksLogicResult => {
  const [selectedReceiptBook, setSelectedReceiptBook] =
    useState<BorrowedBook | null>(null);

  const isEmpty = useMemo(() => !books || books.length === 0, [books]);

  const handleReceiptClick = useCallback(
    (bookId: string) => {
      const book = books.find((b) => b.id === bookId);
      if (book) {
        setSelectedReceiptBook(book);
      }
    },
    [books],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedReceiptBook(null);
  }, []);

  return {
    isEmpty,
    selectedReceiptBook,
    handleReceiptClick,
    handleCloseModal,
  };
};
