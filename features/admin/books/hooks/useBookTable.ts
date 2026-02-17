"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getBooksAction, deleteBookAction } from "../actions/book"; // Added delete action
import { useDebounce } from "@/hooks/useDebounce";
import { Book, SortConfig } from "../types";
import { toast } from "sonner";

export function useBookTable(initialData: Book[], initialPage: number) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [query, setQuery] = useState(searchParams.get("search") || "");
  const debouncedQuery = useDebounce(query, 300);
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || initialPage,
  );
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // --- DELETE MODAL STATE ---
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    bookId: string;
    bookTitle: string;
  }>({
    isOpen: false,
    bookId: "",
    bookTitle: "",
  });

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery) params.set("search", debouncedQuery);
    else params.delete("search");
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, page, pathname, router]);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["books", page, debouncedQuery],
    queryFn: () => getBooksAction({ page, search: debouncedQuery }),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  // Prefetching
  useEffect(() => {
    if (data?.totalPages && page < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["books", page + 1, debouncedQuery],
        queryFn: () =>
          getBooksAction({ page: page + 1, search: debouncedQuery }),
      });
    }
  }, [data, page, debouncedQuery, queryClient]);

  const requestSort = (key: keyof Book) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig?.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : null;
    }
    setSortConfig(direction ? { key, direction } : null);
  };

  // --- DELETE HANDLER ---
  const handleConfirmDelete = async () => {
    try {
      const promise = deleteBookAction(deleteModal.bookId);

      toast.promise(promise, {
        loading: "Deleting book...",
        success: () => {
          // Invalidate cache to refresh the table
          queryClient.invalidateQueries({ queryKey: ["books"] });
          return `${deleteModal.bookTitle} deleted successfully.`;
        },
        error: "Failed to delete the book.",
      });

      setDeleteModal((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const processedData = useMemo(() => {
    const books = [...(data?.books || [])];
    if (sortConfig) {
      books.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return books;
  }, [data?.books, sortConfig]);

  return {
    query,
    setQuery,
    page,
    setPage,
    sortConfig,
    requestSort,
    processedData,
    totalPages: data?.totalPages || 1,
    isLoading,
    isPlaceholderData,
    // Return delete logic
    deleteModal,
    setDeleteModal,
    handleConfirmDelete,
  };
}
