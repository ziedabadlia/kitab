"use client";

import { cn } from "@/lib/utils";
import { useBorrowTable } from "../hooks/useBorrowTable";
import { UserTableSkeleton } from "../../users/components/UserTableSkeleton";
import { TablePagination } from "../../users/components/UsersTable/TablePagination";
import { BorrowRequestRow } from "./BorrowRequestRow";
import BorrowTableHeader from "./BorrowTableHeader";
import { AccountTableEmptyState } from "../../accountRequests/components/AccountTableEmptyState";
import { TableEmptyState } from "@/components/TableEmptyState";
import { BorrowRequest } from "../types";

export function BorrowRequestsTable({ initialData }: any) {
  const table = useBorrowTable(initialData);

  if (table.isLoading) return <UserTableSkeleton />;

  return (
    <div className='w-0 min-w-full space-y-6 bg-white p-5 rounded-2xl'>
      <BorrowTableHeader
        query={table.query}
        setQuery={table.setQuery}
        clearQuery={table.clearQuery}
        onSort={() => table.requestSort("createdAt")}
        sortConfig={table.sortConfig}
      />

      <div
        className={cn(
          "transition-opacity",
          table.isPlaceholderData && "opacity-50 pointer-events-none",
        )}
      >
        <div className='overflow-auto border rounded-xl border-slate-100'>
          <table className='w-full text-left text-sm text-slate-600 min-w-[1200px] table-fixed'>
            <colgroup>
              <col className='w-[300px]' />
              <col className='w-[200px]' />
              <col className='w-[160px]' />
              <col className='w-[140px]' />
              <col className='w-[140px]' />
              <col className='w-[140px]' />
              <col className='w-[140px]' />
              <col className='w-[160px]' />
            </colgroup>
            <thead className='bg-slate-50 text-slate-500 uppercase text-[11px] font-bold'>
              <tr>
                <th className='px-6 py-4'>Book</th>
                <th className='px-6 py-4'>Student</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Requested</th>
                <th className='px-6 py-4'>Borrowed</th>
                <th className='px-6 py-4'>Returned</th>
                <th className='px-6 py-4'>Due Date</th>
                <th className='px-6 py-4 text-center'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100'>
              {table.processedData.length > 0 ? (
                table.processedData.map((request: BorrowRequest) => (
                  <BorrowRequestRow key={request.id} request={request} />
                ))
              ) : (
                <TableEmptyState
                  colSpan={8}
                  hasNoData={table.hasNoData}
                  urlQuery={table.urlQuery}
                  onClear={table.clearQuery}
                  noDataTitle='No Borrowings Yet'
                  noDataDescription='Book requests will appear here once students start borrowing.'
                />
              )}
            </tbody>
          </table>
        </div>

        {table.totalPages > 1 && (
          <div>
            <TablePagination
              currentPage={table.page}
              totalPages={table.totalPages}
              onPageChange={table.setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
