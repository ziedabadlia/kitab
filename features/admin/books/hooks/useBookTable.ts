"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBookAction } from "../actions/book";
import { useBooksQuery } from "./useBooksQuery";
import { DEBOUNCE_MS, BooksPage, booksKeys } from "./useBookTable.utils";

export function useBookTable(initialData: BooksPage) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();

  const urlSearch = searchParams.get("search") ?? "";
  const [localSearch, setLocalSearch] = useState(urlSearch);
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    bookId: "",
    bookTitle: "",
  });

  useEffect(() => {
    setPage(1);
    setLocalSearch(urlSearch);
  }, [urlSearch]);

  const { data, isFetching, isLoading } = useBooksQuery(
    { page, search: urlSearch },
    initialData,
  );

  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      startTransition(() =>
        router.replace(
          `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
        ),
      );
    },
    [router, pathname, searchParams],
  );

  useEffect(() => {
    if (localSearch === urlSearch) return;
    const timer = setTimeout(
      () => updateUrl({ search: localSearch || null }),
      DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [localSearch, urlSearch, updateUrl]);

  const handleConfirmDelete = async () => {
    const { bookId, bookTitle } = deleteModal;
    setDeleteModal((prev) => ({ ...prev, isOpen: false }));
    toast.promise(deleteBookAction(bookId), {
      loading: "Deleting book...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: booksKeys.all });
        return `"${bookTitle}" deleted successfully.`;
      },
      error: "Failed to delete the book.",
    });
  };

  return {
    query: localSearch,
    setQuery: setLocalSearch,
    clearQuery: () => {
      setLocalSearch("");
      updateUrl({ search: null });
    },
    page,
    setPage,
    processedData: data?.books ?? [],
    totalPages: data?.totalPages ?? 1,
    isLoading,
    isPlaceholderData: isFetching && !isLoading,
    deleteModal,
    setDeleteModal,
    handleConfirmDelete,
  };
}
