import { BorrowingStatus } from "@prisma/client";

export const PRE_BORROW_STATUSES: BorrowingStatus[] = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
];

export interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  coverColor: string;
  categories: { name: string }[];
  requestedAt: Date;
  borrowedAt: Date | null;
  dueDate: Date | null;
  returnedAt: Date | null;
  status: BorrowingStatus;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  profilePictureUrl: string | null;
  studentIdNumber: string;
  universityName: string;
  status: string;
  generatedIdCardUrl: string | null;
  dateOfBirth?: Date;
  department?: string;
  contactNo?: string;
  address?: string;
}

export interface IdCardFormData {
  dateOfBirth: string;
  department: string;
  contactNo: string;
  address: string;
}

export interface ReviewAuthor {
  fullName: string;
  profilePictureUrl: string | null;
}

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: ReviewAuthor;
}

export interface ReviewsData {
  reviews: ReviewItem[];
  totalCount: number;
  averageRating: number;
  canReview: boolean;
  hasReviewed: boolean;
  returnedBorrowingId: string | null;
}
