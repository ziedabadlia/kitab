"use client";

import { memo } from "react";
import { BorrowedBook, PRE_BORROW_STATUSES } from "../types";
import { useBookCardStatus } from "../hooks/useBookCardStatus";
import { useBookCardFormatting } from "../hooks/useBookCardFormatting";
import BookCardCover from "./BookCard/BookCardCover";
import BookCardInfo from "./BookCard/BookCardInfo";
import BookCardFooter from "./BookCard/BookCardFooter";
import { UserStatus } from "@prisma/client";

interface BookCardProps {
  book: BorrowedBook;
  onReceiptClick?: (bookId: string) => void;
}

const BookCard = memo(({ book, onReceiptClick }: BookCardProps) => {
  const status = useBookCardStatus(book.status, book.dueDate!, book.returnedAt);
  const { borrowDate, requestedDate, categories } = useBookCardFormatting(book);

  const isPreBorrow = PRE_BORROW_STATUSES.includes(book.status);

  const date = isPreBorrow ? requestedDate : borrowDate;
  const dateLabel = isPreBorrow ? "Requested on" : "Borrowed on";
  const canCancel = book.status === "PENDING";
  const canViewReceipt = !["PENDING", "ACCEPTED", "CANCELLED"].includes(
    book.status,
  );

  return (
    <article className='bg-[#0F1117] rounded-3xl p-7 border border-slate-800/50 flex flex-col gap-5 hover:border-slate-700 transition-colors duration-200 group will-change-transform h-full'>
      <BookCardCover
        coverImage={book.coverImageUrl!}
        coverColor={book.coverColor}
        isOverdue={status.isOverdue}
      />

      <BookCardInfo title={book.title} categories={categories} />

      <BookCardFooter
        date={date}
        dateLabel={dateLabel}
        canCancel={canCancel}
        canViewReceipt={canViewReceipt}
        borrowingId={book.id}
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
