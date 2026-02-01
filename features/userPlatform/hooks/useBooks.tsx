// hooks/useBooks.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { Prisma } from "@prisma/client";

type BookWithCategories = Prisma.BookGetPayload<{
  include: {
    categories: { include: { category: true } };
    department: true;
  };
}>;

interface UseBooksParams {
  query?: string;
  departmentId?: string;
  categoryId?: string;
}

async function fetchBooks(
  params: UseBooksParams,
): Promise<BookWithCategories[]> {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set("q", params.query);
  if (params.departmentId) searchParams.set("department", params.departmentId);
  if (params.categoryId) searchParams.set("category", params.categoryId);

  const response = await fetch(`/api/books?${searchParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch books");
  return response.json();
}

export function useBooks({ query, departmentId, categoryId }: UseBooksParams) {
  return useQuery({
    queryKey: ["books", { query, departmentId, categoryId }],
    queryFn: () => fetchBooks({ query, departmentId, categoryId }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
