"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useFilterOptions } from "@/features/search/hooks/useFilterOptions";

const DEBOUNCE_MS = 300;

export function useSearchBar(onFilterChange?: () => void) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const urlDepartmentId = searchParams.get("department") ?? undefined;
  const urlCategoryId = searchParams.get("category") ?? undefined;

  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useFilterOptions();
  const departments = data?.departments ?? [];
  const categories = data?.categories ?? [];

  const filters = {
    departmentId: urlDepartmentId,
    categoryId: urlCategoryId,
  };

  const activeFilterName = urlDepartmentId
    ? departments.find((d) => d.id === urlDepartmentId)?.name
    : urlCategoryId
      ? categories.find((c) => c.id === urlCategoryId)?.name
      : null;

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

  const handleInputChange = useCallback(
    (value: string) => {
      setLocalQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateUrl({ q: value || null, page: null });
        onFilterChange?.();
      }, DEBOUNCE_MS);
    },
    [updateUrl, onFilterChange],
  );

  const handleClear = useCallback(() => {
    setLocalQuery("");
    updateUrl({ q: null, page: null });
    onFilterChange?.();
    inputRef.current?.focus();
  }, [updateUrl, onFilterChange]);

  const handleClearAll = useCallback(() => {
    setLocalQuery("");
    updateUrl({ q: null, department: null, category: null, page: null });
    onFilterChange?.();
  }, [updateUrl, onFilterChange]);

  const handleFilterSelect = useCallback(
    (newFilters: { departmentId?: string; categoryId?: string }) => {
      updateUrl({
        department: newFilters.departmentId ?? null,
        category: newFilters.categoryId ?? null,
        page: null,
      });
      onFilterChange?.();
      setShowFilters(false);
    },
    [updateUrl, onFilterChange],
  );

  const toggleFilters = useCallback(() => setShowFilters((p) => !p), []);
  const closeFilters = useCallback(() => setShowFilters(false), []);

  return {
    query: localQuery,
    filters,
    inputRef,
    departments,
    categories,
    isLoading,
    showFilters,
    activeFilterName,
    handleInputChange,
    handleClear,
    handleClearAll,
    handleFilterSelect,
    toggleFilters,
    closeFilters,
  };
}
