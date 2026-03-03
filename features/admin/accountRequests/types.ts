import { UserStatus } from "@/prisma/generated/prisma/enums";

export type AccountSortField = "createdAt";
export type SortDirection = "asc" | "desc";

export interface AccountRequest {
  id: string;
  studentIdNumber: string;
  universityName: string;
  universityIdCardUrl: string;
  status: UserStatus;
  dateJoined: string | null;
  rawCreatedAt: string;
  student: {
    fullName: string;
    email: string;
    profilePictureUrl: string | null;
  };
}

export interface GetAccountRequestsResponse {
  requests: AccountRequest[];
  totalPages: number;
  totalRequests: number;
}

export interface GetAccountRequestsParams {
  page?: number;
  pageSize?: number;
  query?: string;
  sortField?: AccountSortField;
  sortDirection?: SortDirection;
}
