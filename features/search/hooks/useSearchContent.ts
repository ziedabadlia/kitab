"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearch } from "@/features/search/contexts/SearchContext";
import { useBooks } from "@/features/search/hooks/useBooks";

export function useSearchContent() {
  const { debouncedQuery, filters } = useSearch();
  const [page, setPage] = useState(1);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const prevPageRef = useRef(page);

  const { data, isLoading, isFetching } = useBooks({
    query: debouncedQuery,
    departmentId: filters.departmentId,
    categoryId: filters.categoryId,
    page,
    limit: 12,
  });

  // Memoize derived values to prevent re-renders
  const books = useMemo(() => data?.books || [], [data?.books]);
  const pagination = useMemo(() => data?.pagination, [data?.pagination]);

  const hasActiveFilters = useMemo(
    () => Boolean(debouncedQuery || filters.departmentId || filters.categoryId),
    [debouncedQuery, filters.departmentId, filters.categoryId],
  );

  // Stable callback - doesn't recreate on every render
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage !== page) {
        setIsChangingPage(true);
        setPage(newPage);
      }
    },
    [page],
  );

  // Reset page when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
      setIsChangingPage(false);
    }
  }, [debouncedQuery, filters.departmentId, filters.categoryId]);

  // Track page change completion
  useEffect(() => {
    if (!isFetching && prevPageRef.current !== page) {
      setIsChangingPage(false);
      prevPageRef.current = page;
    }
  }, [isFetching, page]);

  const showSkeleton = isLoading || isChangingPage;

  return useMemo(
    () => ({
      books,
      pagination,
      isFetching,
      showSkeleton,
      hasActiveFilters,
      handlePageChange,
    }),
    [
      books,
      pagination,
      isFetching,
      showSkeleton,
      hasActiveFilters,
      handlePageChange,
    ],
  );
}
