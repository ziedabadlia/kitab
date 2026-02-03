"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";
import { usePagination } from "@/features/search/hooks/usePagination";

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
  const {
    visiblePages,
    handlePrevious,
    handleNext,
    handlePageClick,
    startItem,
    endItem,
  } = usePagination({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onPageChange,
  });

  if (totalPages <= 1) return null;

  return (
    <div className='flex flex-col items-center gap-4 mt-12'>
      <div className='flex items-center gap-2'>
        {/* Previous Button */}
        <NavButton
          direction='prev'
          onClick={handlePrevious}
          disabled={!hasPrevPage}
        />

        {/* Page Numbers */}
        <div className='flex items-center gap-1'>
          {visiblePages.map((page, idx) => (
            <PageButton
              key={idx}
              page={page}
              isCurrent={page === currentPage}
              onClick={() => handlePageClick(page)}
            />
          ))}
        </div>

        {/* Next Button */}
        <NavButton
          direction='next'
          onClick={handleNext}
          disabled={!hasNextPage}
        />
      </div>

      <p className='text-slate-500 text-sm'>
        Showing {startItem} - {Math.min(endItem, totalCount)} of {totalCount}{" "}
        books
      </p>
    </div>
  );
}

// Navigation Arrow Button (Previous/Next)
const NavButton = memo(function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className='w-10 h-10 flex items-center justify-center rounded-lg 
                 bg-slate-800 text-slate-300 
                 hover:bg-slate-700 hover:text-white
                 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800
                 transition-all duration-200'
    >
      <Icon className='w-5 h-5' />
    </button>
  );
});

// Individual Page Number Button
const PageButton = memo(function PageButton({
  page,
  isCurrent,
  onClick,
}: {
  page: number | string;
  isCurrent: boolean;
  onClick: () => void;
}) {
  // Ellipsis (no click)
  if (page === "...") {
    return (
      <span className='w-10 h-10 flex items-center justify-center text-slate-500 text-sm'>
        ...
      </span>
    );
  }

  const isNumber = typeof page === "number";

  return (
    <button
      onClick={onClick}
      disabled={isCurrent}
      className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-all duration-200
        ${
          isCurrent
            ? "bg-[#E7C9A5] text-slate-900 border border-[#E7C9A5]" // Golden active state
            : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-[#E7C9A5]/50 hover:text-white"
        }
        disabled:cursor-default
      `}
    >
      {page}
    </button>
  );
});
