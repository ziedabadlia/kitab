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
    ...(page === 1 && !urlSearch && !urlSort ? { initialData } : {}),
  });

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

  // Debounced Search
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
