"use client";

import { memo } from "react";
import { BorrowedBook } from "../../types";
import BookCard from "../BookCard";

interface BorrowedBooksGridProps {
  books: BorrowedBook[];
  onReceiptClick: (bookId: string) => void;
}

const BorrowedBooksGrid = memo(
  ({ books, onReceiptClick }: BorrowedBooksGridProps) => {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
        {books.map((book, index) => (
          <div
            key={book.id}
            className={
              index < 12
                ? "animate-in fade-in slide-in-from-bottom-4 duration-500"
                : ""
            }
            style={{
              animationDelay: index < 12 ? `${index * 50}ms` : undefined,
            }}
          >
            <BookCard book={book} onReceiptClick={onReceiptClick} />
          </div>
        ))}
      </div>
    );
  },
);

BorrowedBooksGrid.displayName = "BorrowedBooksGrid";

export default BorrowedBooksGrid;
