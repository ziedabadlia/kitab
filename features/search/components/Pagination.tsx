"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  totalCount: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  totalCount,
}: PaginationProps) {
  // Generate page numbers to show (max 5 visible)
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className='flex flex-col items-center gap-4 mt-12'>
      <div className='flex items-center gap-2'>
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className='p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
                     transition-colors'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>

        {/* Page Numbers */}
        <div className='flex items-center gap-1'>
          {getVisiblePages().map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..." || page === currentPage}
              className={`min-w-10 h-10 px-3 rounded-lg text-sm font-medium transition-all
                ${
                  page === currentPage
                    ? "bg-blue-500 text-white"
                    : page === "..."
                      ? "text-slate-500 cursor-default"
                      : "text-slate-300 hover:bg-slate-800 border border-slate-700"
                }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className='p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
                     transition-colors'
        >
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>

      <p className='text-slate-500 text-sm'>
        Showing {(currentPage - 1) * 12 + 1} -{" "}
        {Math.min(currentPage * 12, totalCount)} of {totalCount} books
      </p>
    </div>
  );
}
