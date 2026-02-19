"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState, useEffect } from "react";
import type { BorrowSortField, SortDirection } from "../actions/borrowing";

export type SortConfig = {
  key: BorrowSortField;
  direction: SortDirection;
};

const DEBOUNCE_MS = 350;

export function useBorrowTable(initialData: {
  requests: any[];
  totalPages: number;
  totalRequests: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // ── Read current URL state ───────────────────────────────────────────────
  const urlQuery = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const sortField =
    (searchParams.get("sort") as BorrowSortField) ?? "createdAt";
  const sortDirection = (searchParams.get("dir") as SortDirection) ?? "desc";
  const sortConfig: SortConfig = { key: sortField, direction: sortDirection };

  // ── Local input state (instant) vs URL state (debounced) ────────────────
  // The input renders `localQuery` so it feels instant.
  // After DEBOUNCE_MS of inactivity we push to the URL, which triggers a
  // server fetch. This prevents a navigation on every keystroke.
  const [localQuery, setLocalQuery] = useState(urlQuery);

  // Keep local state in sync if the URL changes externally (e.g. back button)
  useEffect(() => {
    setLocalQuery(urlQuery);
  }, [urlQuery]);

  // ── URL updater ──────────────────────────────────────────────────────────
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  // ── Debounced search ─────────────────────────────────────────────────────
  useEffect(() => {
    // Skip if local input already matches what's in the URL — avoids
    // pushing on mount or after a back-button sync
    if (localQuery === urlQuery) return;

    const timer = setTimeout(() => {
      updateParams({ query: localQuery || null, page: "1" });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [localQuery]); // eslint-disable-line react-hooks/exhaustive-deps
  // ^ Only localQuery as dep: updateParams and urlQuery would re-trigger
  //   the effect at the wrong times (after URL sync or param rebuild).

  // ── Public setters ───────────────────────────────────────────────────────

  // Updates local state only — the debounce effect handles the URL push
  const setQuery = (val: string) => setLocalQuery(val);

  // Clears search: update local state AND flush to URL immediately (no delay)
  const clearQuery = () => {
    setLocalQuery("");
    updateParams({ query: null, page: "1" });
  };

  const setPage = (val: number) => updateParams({ page: String(val) });

  const requestSort = (key: BorrowSortField) => {
    const newDir: SortDirection =
      sortField === key && sortDirection === "desc" ? "asc" : "desc";
    updateParams({ sort: key, dir: newDir, page: "1" });
  };

  return {
    // Bind the input to `localQuery` for instant feedback while typing
    query: localQuery,
    // Use `urlQuery` where you need the committed search term (empty-state message)
    urlQuery,
    page,
    sortConfig,

    processedData: initialData.requests,
    totalPages: initialData.totalPages,

    isLoading: false,
    isPlaceholderData: isPending,

    setQuery,
    clearQuery,
    setPage,
    requestSort,

    // hasNoData = DB is truly empty (not a failed search)
    hasNoData: initialData.totalRequests === 0 && urlQuery === "",
  };
}
