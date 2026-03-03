import { useAccountTable } from "../hooks/useAccountTable";
import { AccountRequestsPage } from "./useAccountRequestsQuery";

export function useAccountTableState(initialData: AccountRequestsPage) {
  const table = useAccountTable({ initialData });

  const isEmpty = table.processedData.length === 0;
  const showPagination = table.totalPages > 1;

  return {
    ...table,
    isEmpty,
    showPagination,
  };
}
