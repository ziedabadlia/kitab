"use client";

import { memo } from "react";
import SearchBar from "./SearchBar";
import BookGrid from "./BookGrid";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import { useSearchContent } from "@/features/search/hooks/useSearchContent";
import { Loader2 } from "lucide-react";

// Memoize header to prevent re-renders when parent updates
const ResultsHeader = memo(function ResultsHeader({
  pagination,
  isFetching,
  showSkeleton,
  hasActiveFilters,
}: {
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
  isFetching: boolean;
  showSkeleton: boolean;
  hasActiveFilters: boolean;
}) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <h2 className='text-xl font-semibold text-white'>
        {hasActiveFilters ? "Search Results" : "All Books"}
      </h2>
      {pagination && !showSkeleton && (
        <span className='text-slate-400 text-sm flex items-center gap-2'>
          Page {pagination.currentPage} of {pagination.totalPages} (
          {pagination.totalCount} books)
          {isFetching && (
            <Loader2 className='w-4 h-4 animate-spin text-blue-400' />
          )}
        </span>
      )}
    </div>
  );
});

// Memoize pagination to prevent re-renders during data fetch
const MemoizedPagination = memo(function MemoizedPagination({
  pagination,
  onPageChange,
}: {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
}) {
  return (
    <Pagination
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      hasNextPage={pagination.hasNextPage}
      hasPrevPage={pagination.hasPrevPage}
      onPageChange={onPageChange}
      totalCount={pagination.totalCount}
    />
  );
});

export default function SearchContent() {
  const {
    books,
    pagination,
    isFetching,
    showSkeleton,
    hasActiveFilters,
    handlePageChange,
  } = useSearchContent();

  return (
    <div className='py-8'>
      <ResultsHeader
        pagination={pagination}
        isFetching={isFetching}
        showSkeleton={showSkeleton}
        hasActiveFilters={hasActiveFilters}
      />

      <SearchBar />

      <div className='mt-8 min-h-[600px]'>
        {showSkeleton ? (
          <BookGrid.Skeleton />
        ) : books.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <BookGrid books={books} />
            {pagination && (
              <MemoizedPagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
