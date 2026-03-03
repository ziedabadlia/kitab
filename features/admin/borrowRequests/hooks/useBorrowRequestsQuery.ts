import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { GetBorrowingRequestsResponse } from "../types";

const PAGE_SIZE = 10;
const SERVER_DATA_TIMESTAMP = Date.now();

async function fetchBorrowRequests(
  params: any,
): Promise<GetBorrowingRequestsResponse> {
  const sp = new URLSearchParams({
    page: String(params.page),
    pageSize: String(PAGE_SIZE),
    query: params.query,
    sort: params.sort,
    dir: params.dir,
  });
  const res = await fetch(`/api/admin/borrow-requests?${sp}`);
  if (!res.ok) throw new Error("Failed to fetch borrow requests");
  return res.json();
}

export function useBorrowRequestsQuery(
  params: any,
  initialData?: GetBorrowingRequestsResponse,
) {
  const queryClient = useQueryClient();
  const isDefaultView =
    params.page === 1 && params.query === "" && params.dir === "desc";

  const query = useQuery({
    queryKey: ["borrow-requests", params],
    queryFn: () => fetchBorrowRequests(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    ...(isDefaultView && initialData
      ? { initialData, initialDataUpdatedAt: SERVER_DATA_TIMESTAMP }
      : {}),
  });

  useEffect(() => {
    const totalPages = query.data?.totalPages ?? 1;
    if (params.page >= totalPages) return;
    queryClient.prefetchQuery({
      queryKey: ["borrow-requests", { ...params, page: params.page + 1 }],
      queryFn: () => fetchBorrowRequests({ ...params, page: params.page + 1 }),
    });
  }, [params.page, query.data?.totalPages, queryClient, params]);

  return query;
}
