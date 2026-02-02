"use client";

import { useQuery } from "@tanstack/react-query";

interface FilterOptions {
  departments: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

async function fetchFilters(): Promise<FilterOptions> {
  const [deptsRes, catsRes] = await Promise.all([
    fetch("/api/departments"),
    fetch("/api/categories"),
  ]);

  if (!deptsRes.ok || !catsRes.ok) throw new Error("Failed to fetch filters");

  const [departments, categories] = await Promise.all([
    deptsRes.json(),
    catsRes.json(),
  ]);

  return { departments, categories };
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ["filters"],
    queryFn: fetchFilters,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes (filters rarely change)
  });
}
