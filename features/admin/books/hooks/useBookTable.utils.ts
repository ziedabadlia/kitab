import { Book } from "../types";

export const DEBOUNCE_MS = 300;
export const PAGE_SIZE = 10;

export type BooksPage = {
  books: Book[];
  totalPages: number;
};

export async function fetchBooks(params: {
  page: number;
  search: string;
}): Promise<BooksPage> {
  const sp = new URLSearchParams({
    page: String(params.page),
    pageSize: String(PAGE_SIZE),
    search: params.search,
  });
  const res = await fetch(`/api/admin/books?${sp}`);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export const booksKeys = {
  all: ["books"] as const,
  list: (p: { page: number; search: string }) => [...booksKeys.all, p] as const,
};
