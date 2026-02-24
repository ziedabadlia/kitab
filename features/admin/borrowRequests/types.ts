import { BorrowingStatus } from "@prisma/client";

export type BorrowSortField = "createdAt" | "bookTitle";
export type SortDirection = "asc" | "desc";

export interface BorrowRequest {
  id: string;
  status: BorrowingStatus;
  borrowedAt: string | null;
  returnedAt: string | null;
  dueDate: string | null;
  requestedAt: string;
  rawBorrowedAt: string | null;
  rawReturnedAt: string | null;
  rawDueDate: string | null;
  rawCreatedAt: string;
  book: {
    id: string;
    title: string;
    author: string;
    genre: string | null;
    coverImageUrl: string;
    coverColor: string;
  };
  student: {
    fullName: string;
    email: string;
    profilePictureUrl: string | null;
  };
}

export interface GetBorrowingRequestsResponse {
  requests: BorrowRequest[];
  totalPages: number;
  totalRequests: number;
}

export interface GetBorrowingRequestsParams {
  page?: number;
  pageSize?: number;
  query?: string;
  sortField?: BorrowSortField;
  sortDirection?: SortDirection;
}
