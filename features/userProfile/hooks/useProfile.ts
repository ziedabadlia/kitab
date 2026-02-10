"use client";

import { useQuery } from "@tanstack/react-query";
import { StudentProfile, BorrowedBook } from "../types";

async function fetchProfile(): Promise<{
  profile: StudentProfile;
  borrowedBooks: BorrowedBook[];
}> {
  const response = await fetch("/api/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    // Check if response is HTML (error page)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      throw new Error("Authentication required");
    }

    throw new Error(`Failed to fetch profile: ${response.status}`);
  }

  // Verify the response is actually JSON
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Invalid response format");
  }

  return response.json();
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once to avoid hammering the server
    retryDelay: 1000, // Wait 1 second before retry
  });
}
