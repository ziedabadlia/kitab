"use client";

import { SearchX, Inbox } from "lucide-react";
import { useBorrowTable } from "../hooks/useBorrowTable";
import { UserTableSkeleton } from "../../users/components/UserTableSkeleton";
import { TablePagination } from "../../users/components/UsersTable/TablePagination";
import { BorrowRequestRow } from "./BorrowRequestRow";
import BorrowTableHeader from "./BorrowTableHeader";
import { GetBorrowingRequestsResponse } from "../actions/borrowing";
import { cn } from "@/lib/utils";

interface BorrowRequestsTableProps {
  initialData: GetBorrowingRequestsResponse;
}

export function BorrowRequestsTable({ initialData }: BorrowRequestsTableProps) {
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
  } = useBorrowTable(initialData);

  if (isLoading) return <UserTableSkeleton />;

  return (
    <div className='w-0 min-w-full space-y-6 bg-white p-5 rounded-2xl'>
      <BorrowTableHeader
        query={query}
        setQuery={setQuery}
        clearQuery={clearQuery}
        onSort={() => requestSort("createdAt")}
        sortConfig={sortConfig}
      />

      <div
        className={cn(
          "bg-white transition-opacity duration-150",
          isPlaceholderData ? "opacity-50 pointer-events-none" : "opacity-100",
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
              <col className='w-[120px]' />
            </colgroup>

            <thead className='bg-slate-50 text-slate-500 uppercase text-[11px] tracking-wider font-bold'>
              <tr>
                <th className='px-6 py-4'>Book</th>
                <th className='px-6 py-4'>Student</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Requested</th>
                <th className='px-6 py-4'>Borrowed</th>
                <th className='px-6 py-4'>Returned</th>
                <th className='px-6 py-4'>Due Date</th>
                <th className='px-6 py-4 text-right'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-100'>
              {processedData.length > 0 ? (
                processedData.map((request) => (
                  <BorrowRequestRow key={request.id} request={request} />
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      hasNoData={hasNoData}
                      urlQuery={urlQuery}
                      clearQuery={clearQuery}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className='mt-6 flex justify-center'>
            <TablePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for cleaner empty states
function EmptyState({ hasNoData, urlQuery, clearQuery }: any) {
  return (
    <div className='py-32 text-center'>
      {hasNoData ? (
        <div className='flex flex-col items-center max-w-sm mx-auto'>
          <div className='bg-[#25388C]/10 p-6 rounded-full mb-5'>
            <Inbox size={40} className='text-[#25388C]' />
          </div>
          <h3 className='text-lg font-bold text-slate-900'>
            No Borrowings Yet
          </h3>
          <p className='text-slate-500 mt-2'>
            Book requests will appear here once students start borrowing.
          </p>
        </div>
      ) : (
        <div className='flex flex-col items-center text-slate-400'>
          <div className='bg-slate-50 p-4 rounded-full mb-4'>
            <SearchX className='w-8 h-8 opacity-40' />
          </div>
          <p className='text-base font-medium text-slate-600'>
            No matches found
          </p>
          <p className='text-sm mt-1'>
            We couldn&apos;t find any requests for &quot;{urlQuery}&quot;
          </p>
          <button
            onClick={clearQuery}
            className='mt-4 text-[#25388C] font-medium hover:underline cursor-pointer'
          >
            Clear search filters
          </button>
        </div>
      )}
    </div>
  );
}
