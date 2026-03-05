import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useEffect } from "react";

export type AccountRequestsPage = {
  requests: any[];
  totalPages: number;
  totalRequests: number;
};

const PAGE_SIZE = 10;
const SERVER_DATA_TIMESTAMP = Date.now();

async function fetchAccountRequests(params: {
  page: number;
  query: string;
  sort: string;
  dir: string;
}): Promise<AccountRequestsPage> {
  const sp = new URLSearchParams({
    page: String(params.page),
    pageSize: String(PAGE_SIZE),
    query: params.query,
    sort: params.sort,
    dir: params.dir,
  });
  const res = await fetch(`/api/admin/account-requests?${sp}`);
  if (!res.ok) throw new Error("Failed to fetch account requests");
  return res.json();
}

export const accountRequestsKeys = {
  all: ["account-requests"] as const,
  list: (p: any) => [...accountRequestsKeys.all, p] as const,
};

export function useAccountRequestsQuery(
  params: any,
  initialData?: AccountRequestsPage,
) {
  const queryClient = useQueryClient();

  const isDefaultView =
    params.page === 1 && params.query === "" && params.dir === "desc";

  const query = useQuery({
    queryKey: accountRequestsKeys.list(params),
    queryFn: () => fetchAccountRequests(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    refetchInterval: isDefaultView ? 5000 : false,
    refetchIntervalInBackground: false,
    ...(isDefaultView && initialData
      ? { initialData, initialDataUpdatedAt: SERVER_DATA_TIMESTAMP }
      : {}),
  });

  useEffect(() => {
    const totalPages = query.data?.totalPages ?? 1;
    if (params.page >= totalPages) return;

    const nextParams = { ...params, page: params.page + 1 };
    queryClient.prefetchQuery({
      queryKey: accountRequestsKeys.list(nextParams),
      queryFn: () => fetchAccountRequests(nextParams),
    });
  }, [params.page, query.data?.totalPages, queryClient, params]);

  return query;
}
