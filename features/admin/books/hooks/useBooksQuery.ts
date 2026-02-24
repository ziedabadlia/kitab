import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { BooksPage, booksKeys, fetchBooks } from "./useBookTable.utils";

export function useBooksQuery(
  params: { page: number; search: string },
  initialData: BooksPage,
) {
  const queryClient = useQueryClient();
  const isDefaultView = params.page === 1 && params.search === "";

  const query = useQuery({
    queryKey: booksKeys.list(params),
    queryFn: () => fetchBooks(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...(isDefaultView ? { initialData, initialDataUpdatedAt: Date.now() } : {}),
  });

  // Prefetching logic moved here
  useEffect(() => {
    const totalPages = query.data?.totalPages ?? 1;
    if (params.page >= totalPages) return;
    queryClient.prefetchQuery({
      queryKey: booksKeys.list({
        page: params.page + 1,
        search: params.search,
      }),
      queryFn: () =>
        fetchBooks({ page: params.page + 1, search: params.search }),
    });
  }, [params.page, query.data?.totalPages, params.search, queryClient]);

  return query;
}
