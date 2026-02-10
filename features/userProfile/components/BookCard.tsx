"use client";

import { memo } from "react";
import { BorrowedBook } from "../types";
import { useBookCardStatus } from "../hooks/useBookCardStatus";
import { useBookCardFormatting } from "../hooks/useBookCardFormatting";
import BookCardCover from "./BookCard/BookCardCover";
import BookCardInfo from "./BookCard/BookCardInfo";
import BookCardFooter from "./BookCard/BookCardFooter";

interface BookCardProps {
  book: BorrowedBook;
  onReceiptClick?: (bookId: string) => void;
}

const BookCard = memo(({ book, onReceiptClick }: BookCardProps) => {
  const status = useBookCardStatus(book.status, book.dueDate, book.returnedAt);
  const { borrowDate, categories } = useBookCardFormatting(book);

  return (
    <article className='bg-[#0F1117] rounded-3xl p-7 border border-slate-800/50 flex flex-col gap-5 hover:border-slate-700 transition-colors duration-200 group will-change-transform h-full'>
      <BookCardCover
        coverImage={book.coverImageUrl!}
        coverColor={book.coverColor}
        isOverdue={status.isOverdue}
      />

      <BookCardInfo title={book.title} categories={categories} />

      <BookCardFooter
        borrowDate={borrowDate}
        coverColor={book.coverColor}
        statusLabel={status.statusLabel}
        themeClass={status.themeClass}
        dotClass={status.dotClass}
        isOnTime={status.isOnTime}
        bookId={book.id}
        onReceiptClick={onReceiptClick}
      />
    </article>
  );
});

BookCard.displayName = "BookCard";

export default BookCard;
