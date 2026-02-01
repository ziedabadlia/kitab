"use client";

import { useState, useEffect } from "react";
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

export function useBooks({ query, departmentId, categoryId }: UseBooksParams) {
  const [books, setBooks] = useState<BookWithCategories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      if (books.length > 0) setIsFetching(true);
      else setIsLoading(true);

      try {
        const searchParams = new URLSearchParams();
        if (query) searchParams.set("q", query);
        if (departmentId) searchParams.set("department", departmentId);
        if (categoryId) searchParams.set("category", categoryId);

        const response = await fetch(`/api/books?${searchParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch books");

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    fetchBooks();
  }, [query, departmentId, categoryId]);

  return { data: books, isLoading, isFetching };
}
