"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useBooks } from "@/features/search/hooks/useBooks";

export function useSearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const urlDepartmentId = searchParams.get("department") ?? undefined;
  const urlCategoryId = searchParams.get("category") ?? undefined;
  const urlPage = Number(searchParams.get("page") ?? "1");

  const [isChangingPage, setIsChangingPage] = useState(false);
  const prevPageRef = useRef(urlPage);

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (!value) params.delete(key);
        else params.set(key, value);
      }
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage !== urlPage) {
        setIsChangingPage(true);
        updateUrl({ page: String(newPage) });
      }
    },
    [urlPage, updateUrl],
  );

  const { data, isLoading, isFetching } = useBooks({
    query: urlQuery,
    departmentId: urlDepartmentId,
    categoryId: urlCategoryId,
    page: urlPage,
    limit: 12,
  });

  const books = useMemo(() => data?.books ?? [], [data?.books]);
  const pagination = useMemo(() => data?.pagination, [data?.pagination]);

  const hasActiveFilters = useMemo(
    () => Boolean(urlQuery || urlDepartmentId || urlCategoryId),
    [urlQuery, urlDepartmentId, urlCategoryId],
  );

  // Track page change completion
  useEffect(() => {
    if (!isFetching && prevPageRef.current !== urlPage) {
      setIsChangingPage(false);
      prevPageRef.current = urlPage;
    }
  }, [isFetching, urlPage]);

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
