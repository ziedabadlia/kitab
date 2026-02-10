"use client";

import { memo } from "react";
import { BorrowedBook } from "../../types";

interface ReceiptBookDetailsProps {
  book: BorrowedBook;
  formatDate: (date: string | Date) => string;
}

const ReceiptBookDetails = memo(
  ({ book, formatDate }: ReceiptBookDetailsProps) => {
    return (
      <div className='space-y-2'>
        <h3 className='text-sm font-bold text-white uppercase tracking-wide'>
          Book Details:
        </h3>
        <ul className='space-y-1 text-sm'>
          <li className='flex items-start gap-3'>
            <span className='text-slate-400 shrink-0'>•</span>
            <div className='flex items-start gap-2'>
              <span className='text-slate-400 min-w-fit'>Title:</span>
              <span className='text-white font-semibold'>{book.title}</span>
            </div>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-slate-400 shrink-0'>•</span>
            <div className='flex items-start gap-2'>
              <span className='text-slate-400 min-w-fit'>Author:</span>
              <span className='text-white font-semibold'>{book.author}</span>
            </div>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-slate-400 shrink-0'>•</span>
            <div className='flex items-start gap-2'>
              <span className='text-slate-400 min-w-fit'>Genre:</span>
              <span className='text-white font-semibold'>
                {book.categories
                  .map((category) => category.name.trim())
                  .join(" / ")}
              </span>
            </div>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-slate-400 shrink-0'>•</span>
            <div className='flex items-start gap-2'>
              <span className='text-slate-400 min-w-fit'>Borrowed On:</span>
              <span className='text-white font-semibold'>
                {formatDate(book.borrowedAt)}
              </span>
            </div>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-slate-400 shrink-0'>•</span>
            <div className='flex items-start gap-2'>
              <span className='text-slate-400 min-w-fit'>Due Date:</span>
              <span className='text-[#E7C9A5] font-semibold'>
                {formatDate(book.dueDate)}
              </span>
            </div>
          </li>
        </ul>
      </div>
    );
  },
);

ReceiptBookDetails.displayName = "ReceiptBookDetails";

export default ReceiptBookDetails;
