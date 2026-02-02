"use client";

import { useDebounce } from "@/hooks/useDebounce";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

interface SearchFilters {
  departmentId?: string;
  categoryId?: string;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  debouncedQuery: string;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});

  const debouncedQuery = useDebounce(query, 500);

  // Memoize callbacks to prevent unnecessary re-renders of child components
  const handleSetQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const handleSetFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setFilters({});
  }, []);

  // Memoize context value to prevent re-renders when other state changes
  const value = useMemo(
    () => ({
      query,
      setQuery: handleSetQuery,
      debouncedQuery,
      filters,
      setFilters: handleSetFilters,
      clearFilters,
      clearSearch,
    }),
    [
      query,
      debouncedQuery,
      filters,
      handleSetQuery,
      handleSetFilters,
      clearFilters,
      clearSearch,
    ],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within SearchProvider");
  return context;
};
