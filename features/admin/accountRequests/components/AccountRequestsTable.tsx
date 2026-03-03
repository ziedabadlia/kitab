"use client";

import { TableEmptyState } from "@/components/TableEmptyState";
import { UserTableSkeleton } from "../../users/components/UserTableSkeleton";
import { TablePagination } from "../../users/components/UsersTable/TablePagination";
import { AccountRequestsPage } from "../hooks/useAccountRequestsQuery";
import { useAccountTable } from "../hooks/useAccountTable";
import { useAccountTableState } from "../hooks/useAccountTableState";
import { AccountRequestRow } from "./AccountRequestRow";
import { AccountTableEmptyState } from "./AccountTableEmptyState";
import AccountTableHeader from "./AccountTableHeader";

const scrollbarStyles = `
  .account-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
  .account-scroll::-webkit-scrollbar-track { background: transparent; }
  .account-scroll::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 999px; }
  .account-scroll::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
  .account-scroll { scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; }
`;

interface Props {
  initialData: AccountRequestsPage;
}

export function AccountRequestsTable({ initialData }: Props) {
  const {
    query,
    urlQuery,
    setQuery,
    clearQuery,
    page,
    setPage,
    processedData,
    totalPages,
    isLoading,
    isPlaceholderData,
    requestSort,
    sortConfig,
    hasNoData,
    isEmpty,
    showPagination,
  } = useAccountTableState(initialData);

  if (isLoading) return <UserTableSkeleton />;

  return (
    <div className='w-0 min-w-full space-y-6 bg-white rounded-2xl overflow-hidden p-5'>
      <style>{scrollbarStyles}</style>

      <AccountTableHeader
        query={query}
        setQuery={setQuery}
        clearQuery={clearQuery}
        onSort={() => requestSort("createdAt")}
        sortConfig={sortConfig}
      />

      <div
        className={`bg-white transition-opacity duration-150 ${
          isPlaceholderData ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className='account-scroll overflow-auto max-h-[600px]'>
          <table className='w-full text-left text-sm text-slate-600 min-w-[900px] table-fixed border-separate border-spacing-0'>
            <colgroup>
              <col className='w-[260px]' />
              <col className='w-[140px]' />
              <col className='w-[180px]' />
              <col className='w-40' />
              <col className='w-[220px]' />
            </colgroup>

            <thead className='sticky top-0 bg-slate-50 z-30'>
              <tr>
                <th className='px-6 py-4 font-semibold'>Name</th>
                <th className='px-6 py-4 font-semibold'>Date Joined</th>
                <th className='px-6 py-4 font-semibold'>University ID No</th>
                <th className='px-6 py-4 font-semibold'>University ID Card</th>
                <th className='px-6 py-4 font-semibold'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-100'>
              {!isEmpty ? (
                processedData.map((request) => (
                  <AccountRequestRow key={request.id} request={request} />
                ))
              ) : (
                <TableEmptyState
                  colSpan={5}
                  hasNoData={hasNoData}
                  urlQuery={urlQuery}
                  onClear={clearQuery}
                  noDataTitle='No Pending Requests'
                  noDataDescription='All account registration requests have been processed. New requests will appear here.'
                />
              )}
            </tbody>
          </table>
        </div>

        {showPagination && (
          <TablePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
