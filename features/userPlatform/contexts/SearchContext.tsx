"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useDebounce } from "../hooks/useDebounce";

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

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setFilters({});
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        debouncedQuery,
        filters,
        setFilters,
        clearFilters,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within SearchProvider");
  return context;
};
