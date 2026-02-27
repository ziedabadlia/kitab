export type UserSortField = "fullName" | "createdAt" | "booksBorrowed";
export type SortDirection = "asc" | "desc";

export type SortConfig = {
  key: UserSortField;
  direction: SortDirection;
} | null;

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  dateJoined: string;
  booksBorrowed: number;
  universityId: string;
  universityCard: string;
}

export interface UsersPage {
  users: User[];
  totalPages: number;
}

export interface DeleteModalState {
  isOpen: boolean;
  userId: string | null;
  userName: string | null;
  email: string | null;
}
