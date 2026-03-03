"use client";

import SortArrow from "@/components/SortArrow";
import { Search, X, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { SortConfig } from "../hooks/useBorrowTable";

interface BorrowTableHeaderProps {
  query: string;
  setQuery: (val: string) => void;
  clearQuery: () => void;
  onSort: (key: string) => void;
  sortConfig: SortConfig | null;
}

const BorrowTableHeader = ({
  query,
  setQuery,
  clearQuery,
  onSort,
  sortConfig,
}: BorrowTableHeaderProps) => {
  const isOldestFirstActive =
    sortConfig?.key === "createdAt" && sortConfig?.direction === "asc";

  return (
    <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8'>
      <div className='flex-shrink-0'>
        <h1 className='text-2xl text-[#1E293B] font-bold tracking-tight'>
          Borrow Book Requests
        </h1>
        <p className='text-slate-500 text-sm mt-1'>
          Manage and track library borrowings.
        </p>
      </div>

      <div className='flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto'>
        <div className='relative w-full sm:w-80 group'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#253585] transition-colors' />
          <input
            type='text'
            placeholder='Search by book, student, or status...'
            className='w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 focus:bg-white focus:border-[#253585] focus:ring-4 focus:ring-blue-600/5 transition-all'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={clearQuery}
              className='absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer'
              aria-label='Clear search'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        <button
          onClick={() => onSort("createdAt")}
          type='button'
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all cursor-pointer whitespace-nowrap",
            isOldestFirstActive
              ? "bg-[#25388C] border-[#25388C] text-white"
              : "bg-white border-slate-200 text-[#3A354E] hover:bg-slate-50",
          )}
        >
          <CalendarDays
            className={cn(
              "w-4 h-4",
              isOldestFirstActive ? "text-white" : "text-slate-400",
            )}
          />
          <span className='font-semibold text-sm'>
            {isOldestFirstActive ? "Oldest First" : "Recent First"}
          </span>
          <SortArrow
            fillColor={isOldestFirstActive ? "white" : "#3A354E"}
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOldestFirstActive ? "rotate-180" : "rotate-0",
            )}
          />
        </button>
      </div>
    </div>
  );
};

export default BorrowTableHeader;
