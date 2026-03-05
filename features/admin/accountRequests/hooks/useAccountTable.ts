"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useTransition } from "react";
import {
  useAccountRequestsQuery,
  type AccountRequestsPage,
} from "./useAccountRequestsQuery";

const DEBOUNCE_MS = 500;

export function useAccountTable({
  initialData,
}: { initialData?: AccountRequestsPage } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const urlQuery = searchParams.get("query") ?? "";
  const sortField = (searchParams.get("sort") as "createdAt") ?? "createdAt";
  const sortDirection = (searchParams.get("dir") as "asc" | "desc") ?? "desc";

  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    setLocalQuery(urlQuery);
  }, [urlQuery, sortField, sortDirection]);

  const { data, isLoading, isPlaceholderData } = useAccountRequestsQuery(
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
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== urlQuery) updateUrl({ query: localQuery });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [localQuery, urlQuery, updateUrl]);

  return {
    query: localQuery,
    urlQuery,
    page,
    sortConfig: { key: sortField, direction: sortDirection },
    processedData: data?.requests ?? [],
    totalPages: data?.totalPages ?? 1,
    totalRequests: data?.totalRequests ?? 0,
    isLoading,
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
