import { useEffect, useState, useMemo } from "react";
import { BorrowedBook } from "../types";

export const useReceiptModalLogic = (
  isOpen: boolean,
  book: BorrowedBook | null,
) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const formatDate = (date: string | Date) => {
    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  const receiptId = useMemo(() => {
    return book?.id ? book.id.substring(0, 5).toUpperCase() : "";
  }, [book?.id]);

  const shouldRender = mounted && isOpen && !!book;

  return {
    shouldRender,
    receiptId,
    formatDate,
    currentDate: formatDate(new Date()),
  };
};
