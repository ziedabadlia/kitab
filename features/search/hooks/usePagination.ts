"use client";

import { useMemo, useCallback } from "react";

interface UsePaginationParams {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export function usePagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: UsePaginationParams) {
  // Generate visible page numbers (max 5 shown)
  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
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

    return pages;
  }, [currentPage, totalPages]);

  const handlePrevious = useCallback(() => {
    if (hasPrevPage) onPageChange(currentPage - 1);
  }, [hasPrevPage, currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (hasNextPage) onPageChange(currentPage + 1);
  }, [hasNextPage, currentPage, onPageChange]);

  const handlePageClick = useCallback(
    (page: number | string) => {
      if (typeof page === "number" && page !== currentPage) {
        onPageChange(page);
      }
    },
    [currentPage, onPageChange],
  );

  const startItem = (currentPage - 1) * 12 + 1;
  const endItem = Math.min(currentPage * 12, totalPages * 12);

  return {
    visiblePages,
    handlePrevious,
    handleNext,
    handlePageClick,
    startItem,
    endItem,
  };
}
