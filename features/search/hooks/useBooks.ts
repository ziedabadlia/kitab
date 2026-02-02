"use client";

import { useQuery } from "@tanstack/react-query";
import { Prisma } from "@prisma/client";

type BookWithCategories = Prisma.BookGetPayload<{
  include: {
    categories: { include: { category: true } };
    department: true;
  };
}>;

interface BooksResponse {
  books: BookWithCategories[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface UseBooksParams {
  query?: string;
  departmentId?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

const fetchBooks = async (params: UseBooksParams): Promise<BooksResponse> => {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set("q", params.query);
  if (params.departmentId) searchParams.set("department", params.departmentId);
  if (params.categoryId) searchParams.set("category", params.categoryId);
  searchParams.set("page", (params.page || 1).toString());
  searchParams.set("limit", (params.limit || 12).toString());

  const response = await fetch(`/api/books?${searchParams.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch books");
  return response.json();
};

export function useBooks({
  query,
  departmentId,
  categoryId,
  page = 1,
  limit = 12,
}: UseBooksParams) {
  return useQuery({
    queryKey: ["books", { query, departmentId, categoryId, page, limit }],
    queryFn: () => fetchBooks({ query, departmentId, categoryId, page, limit }),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    placeholderData: (previousData) => previousData, // Smooth pagination - keep old data while loading new
  });
}
