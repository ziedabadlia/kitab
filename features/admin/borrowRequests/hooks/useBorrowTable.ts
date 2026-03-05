"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useTransition } from "react";
import { useBorrowRequestsQuery } from "./useBorrowRequestsQuery";

export interface SortConfig {
  key: string;
  direction: "asc" | "desc" | string;
}

export function useBorrowTable(initialData: any) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlQuery = searchParams.get("query") ?? "";
  const sortField = searchParams.get("sort") ?? "createdAt";
  const sortDirection = searchParams.get("dir") ?? "desc";

  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isPlaceholderData } =
    useBorrowRequestsQuery(
      { page, query: urlQuery, sort: sortField, dir: sortDirection },
      initialData,
    );

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== urlQuery) updateUrl({ query: localQuery });
    }, 350);
    return () => clearTimeout(timer);
  }, [localQuery, urlQuery, updateUrl]);

  return {
    query: localQuery,
    urlQuery,
    page,
    sortConfig: { key: sortField, direction: sortDirection },
    processedData: data?.requests ?? [],
    totalPages: data?.totalPages ?? 1,
    isLoading,
    // Only dim the table when paginating/searching, not during background polling
    isPlaceholderData,
    hasNoData: (data?.totalRequests ?? 0) === 0 && urlQuery === "",
    setQuery: setLocalQuery,
    clearQuery: () => {
      setLocalQuery("");
      updateUrl({ query: null });
    },
    setPage,
    requestSort: (key: string) => {
      const dir =
        sortField === key && sortDirection === "desc" ? "asc" : "desc";
      updateUrl({ sort: key, dir });
    },
  };
}
