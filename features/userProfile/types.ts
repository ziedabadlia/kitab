import { BorrowingStatus } from "@prisma/client";

export interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  coverColor: string;
  categories: { name: string }[];
  borrowedAt: Date;
  dueDate: Date;
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
