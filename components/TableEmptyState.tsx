"use client";

import { SearchX, Inbox, LucideIcon } from "lucide-react";

interface TableEmptyStateProps {
  colSpan: number; // Important for table layout
  hasNoData: boolean;
  urlQuery?: string;
  onClear: () => void;
  noDataTitle: string;
  noDataDescription: string;
  noDataIcon?: LucideIcon;
}

export function TableEmptyState({
  colSpan,
  hasNoData,
  urlQuery,
  onClear,
  noDataTitle,
  noDataDescription,
  noDataIcon: NoDataIcon = Inbox,
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className='py-24 w-full flex justify-center items-center'>
          {hasNoData ? (
            <div className='flex flex-col items-center max-w-xs mx-auto text-center animate-in fade-in zoom-in-95 duration-300'>
              <div className='bg-[#25388C]/10 p-5 rounded-full mb-4'>
                <NoDataIcon size={32} className='text-[#25388C]' />
              </div>
              <h3 className='text-lg font-bold text-slate-900'>
                {noDataTitle}
              </h3>
              <p className='text-slate-500 text-sm mt-2'>{noDataDescription}</p>
            </div>
          ) : (
            <div className='flex flex-col items-center max-w-xs mx-auto text-center text-slate-400 animate-in fade-in zoom-in-95 duration-300'>
              <div className='bg-slate-100 p-5 rounded-full mb-4'>
                <SearchX className='w-8 h-8 opacity-40 text-slate-600' />
              </div>
              <p className='text-base font-semibold text-slate-600'>
                No matches found
              </p>
              <p className='text-sm mt-1'>
                Results for{" "}
                <span className='text-slate-900 font-medium'>
                  &quot;{urlQuery}&quot;
                </span>{" "}
                not found.
              </p>
              <button
                onClick={onClear}
                className='mt-4 text-[#25388C] text-sm font-bold hover:underline cursor-pointer'
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
