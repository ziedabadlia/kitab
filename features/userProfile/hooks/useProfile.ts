"use client";

import { useQuery } from "@tanstack/react-query";
import { StudentProfile, BorrowedBook } from "../types";

async function fetchProfile(): Promise<{
  profile: StudentProfile;
  borrowedBooks: BorrowedBook[];
}> {
  const response = await fetch("/api/profile");
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5,
  });
}
