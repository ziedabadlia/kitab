"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getUsersAction } from "../actions/user";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

export function useUserTable(initialData: any, initialPage: number) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Initialize state from URL params if they exist
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const debouncedQuery = useDebounce(query, 300);
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || initialPage,
  );

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string | null;
    email: string | null;
  }>({ isOpen: false, userId: null, userName: null, email: null });

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Sync State to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedQuery) {
      params.set("search", debouncedQuery);
    } else {
      params.delete("search");
    }

    params.set("page", page.toString());

    // Update URL without a full page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, page, pathname, router]);

  // TanStack Query
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["users", page, debouncedQuery],
    queryFn: () => getUsersAction({ page, search: debouncedQuery }),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000,
  });

  // Prefetch next page logic...
  useEffect(() => {
    if (data?.totalPages && page < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["users", page + 1, debouncedQuery],
        queryFn: () =>
          getUsersAction({ page: page + 1, search: debouncedQuery }),
      });
    }
  }, [data, page, debouncedQuery, queryClient]);

  const handleConfirmDelete = async () => {
    if (!deleteModal?.userId) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: deleteModal.userId,
          email: deleteModal.email,
        }),
      });

      const json = await res.json();
      if (!res.ok || json?.error) {
        toast.error(json?.error || "Failed to delete user.");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteModal({
        isOpen: false,
        userId: null,
        userName: null,
        email: null,
      });
      toast.success("User deleted.");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const processedData = useMemo(() => {
    let users = [...(data?.users || [])];
    if (sortConfig) {
      users.sort((a: any, b: any) => {
        const aVal = a[sortConfig.key] ?? "";
        const bVal = b[sortConfig.key] ?? "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return users;
  }, [data, sortConfig]);

  return {
    query,
    setQuery,
    page,
    setPage,
    selectedImage,
    setSelectedImage,
    deleteModal,
    setDeleteModal,
    handleConfirmDelete,
    processedData,
    totalPages: data?.totalPages || 1,
    isLoading,
    isPlaceholderData,
    requestSort: (key: string) => {
      setSortConfig((prev) => ({
        key,
        direction:
          prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
      }));
    },
  };
}
