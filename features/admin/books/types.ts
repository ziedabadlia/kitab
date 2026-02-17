export interface BookCategory {
  name: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  department: string;
  coverImageUrl: string | null;
  coverColor: string | null;
  createdAt: string;
}

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: keyof Book;
  direction: SortDirection;
}

export interface BookActionResponse {
  books: Book[];
  totalPages: number;
}

export interface FetchBooksParams {
  page?: number;
  search?: string;
  pageSize?: number;
}
