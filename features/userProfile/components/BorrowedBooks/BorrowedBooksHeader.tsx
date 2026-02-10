"use client";

import { memo } from "react";

interface BorrowedBooksHeaderProps {
  bookCount: number;
}

const BorrowedBooksHeader = memo(({ bookCount }: BorrowedBooksHeaderProps) => {
  return (
    <div className='flex justify-between items-center'>
      <h2 className='text-2xl font-bold text-white'>
        Borrowed books
        <span className='ml-3 text-base text-slate-400 font-normal'>
          ({bookCount} {bookCount === 1 ? "book" : "books"})
        </span>
      </h2>
    </div>
  );
});

BorrowedBooksHeader.displayName = "BorrowedBooksHeader";

export default BorrowedBooksHeader;
