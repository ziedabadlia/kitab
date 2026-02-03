"use client";

import { useRef, useState, useCallback } from "react";
import { useSearch } from "@/features/search/contexts/SearchContext";
import { useFilterOptions } from "@/features/search/hooks/useFilterOptions";

export function useSearchBar(onFilterChange?: () => void) {
  const { query, setQuery, filters, setFilters, clearSearch } = useSearch();
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useFilterOptions();

  const departments = data?.departments || [];
  const categories = data?.categories || [];

  const activeFilterName = filters.departmentId
    ? departments.find((d) => d.id === filters.departmentId)?.name
    : filters.categoryId
      ? categories.find((c) => c.id === filters.categoryId)?.name
      : null;

  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      onFilterChange?.();
    },
    [setQuery, onFilterChange],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    onFilterChange?.();
    inputRef.current?.focus();
  }, [setQuery, onFilterChange]);

  const handleClearAll = useCallback(() => {
    clearSearch();
    onFilterChange?.();
  }, [clearSearch, onFilterChange]);

  const handleFilterSelect = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
      onFilterChange?.();
      setShowFilters(false);
    },
    [setFilters, onFilterChange],
  );

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const closeFilters = useCallback(() => {
    setShowFilters(false);
  }, []);

  return {
    query,
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
