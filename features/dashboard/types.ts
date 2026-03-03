export interface DashboardStats {
  totalUsers: number;
  userGrowth: number; // Percentage change
  totalBooks: number;
  bookGrowth: number; // Percentage change
  borrowedBooks: number;
  borrowGrowth: number; // Percentage change
  pendingBorrowRequests: number;
  pendingAccountRequests: number;
}

export interface RecentBook {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string;
  coverColor: string;
  categories: string;
  createdAt: string;
}

export interface RecentBorrowRequest {
  id: string;
  bookTitle: string;
  coverImageUrl: string;
  coverColor: string;
  author: string;
  genre: string;
  studentName: string;
  studentAvatar: string | null;
  requestedAt: string;
}

export interface RecentAccountRequest {
  id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  universityName: string;
  requestedAt: string;
}

export interface DashboardDataResponse {
  stats: DashboardStats;
  recentBooks: RecentBook[];
  recentBorrowRequests: RecentBorrowRequest[];
  recentAccountRequests: RecentAccountRequest[];
}
