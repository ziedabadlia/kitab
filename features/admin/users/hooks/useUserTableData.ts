"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState, useEffect } from "react";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchUsers, usersKeys } from "../services/userService";
import {
  SortConfig,
  UserSortField,
  SortDirection,
  UsersPage,
} from "../types/users";

const DEBOUNCE_MS = 300;
const DEFAULT_SEARCH = "";
const DEFAULT_SORT = "createdAt";
const DEFAULT_DIR = "desc";

// Captured once at module load — tells React Query the server data is "fresh as of now".
// Without this, initialData defaults to epoch 0 → immediately stale → background refetch
// fires on mount → cache updates mid-render → totalPages changes → phantom extra pages.
const SERVER_DATA_TIMESTAMP = Date.now();

export function useUserTableData(initialData: UsersPage) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

  // URL state
  const urlSearch = searchParams.get("search") ?? DEFAULT_SEARCH;
  const urlSort = searchParams.get("sort");
  const urlDir = searchParams.get("dir");

  const [localSearch, setLocalSearch] = useState(urlSearch);
  const [page, setPage] = useState(1);

  const sortConfig: SortConfig =
    urlSort && urlDir
      ? { key: urlSort as UserSortField, direction: urlDir as SortDirection }
      : null;

  const isDefaultView = page === 1 && !urlSearch && !urlSort;

  const queryParams = {
    page,
    search: urlSearch,
    sort: urlSort ?? DEFAULT_SORT,
    dir: urlDir ?? DEFAULT_DIR,
  };

  // Sync URL search to local input
  useEffect(() => {
    setPage(1);
    setLocalSearch(urlSearch);
  }, [urlSearch, urlSort, urlDir]);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: usersKeys.list(queryParams),
    queryFn: () => fetchUsers(queryParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    // initialDataUpdatedAt is critical — without it React Query treats initialData
    // as stale from epoch 0 and fires an immediate background refetch on mount.
    ...(isDefaultView
      ? { initialData, initialDataUpdatedAt: SERVER_DATA_TIMESTAMP }
      : {}),
  });

  // Prefetch next page — depend only on `page`, NOT `data?.totalPages`.
  // Including data?.totalPages in deps causes a cascade: prefetch resolves →
  // data changes → effect re-runs → next page prefetches → pagination grows.
  useEffect(() => {
    const cached = queryClient.getQueryData<UsersPage>(
      usersKeys.list(queryParams),
    );
    const totalPages = cached?.totalPages ?? data?.totalPages ?? 1;
    if (page >= totalPages) return;
    const nextParams = { ...queryParams, page: page + 1 };
    queryClient.prefetchQuery({
      queryKey: usersKeys.list(nextParams),
      queryFn: () => fetchUsers(nextParams),
      staleTime: 1000 * 60 * 5,
    });
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      const qs = params.toString();
      startTransition(() => router.replace(`${pathname}${qs ? `?${qs}` : ""}`));
    },
    [router, pathname, searchParams],
  );

  // Debounced search
  useEffect(() => {
    if (localSearch === urlSearch) return;
    const timer = setTimeout(
      () => updateUrl({ search: localSearch || null }),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [localSearch, urlSearch, updateUrl]);

  const requestSort = (key: UserSortField) => {
    if (sortConfig?.key !== key) updateUrl({ sort: key, dir: "asc" });
    else if (sortConfig.direction === "asc")
      updateUrl({ sort: key, dir: "desc" });
    else updateUrl({ sort: null, dir: null });
  };

  return {
    localSearch,
    setLocalSearch,
    page,
    setPage,
    sortConfig,
    requestSort,
    data,
    isLoading,
    isPlaceholderData: isFetching && !isLoading,
    updateUrl,
  };
}
