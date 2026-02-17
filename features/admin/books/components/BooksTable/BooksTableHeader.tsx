"use client";

import SortArrow from "@/components/SortArrow";
import { Search, X, Plus } from "lucide-react";
import Link from "next/link";
import { SortConfig } from "../../types";

interface Props {
  query: string;
  setQuery: (val: string) => void;
  onSort: () => void;
  // Allow null so the UI can revert to default state when sorting is disabled
  sortConfig: SortConfig | null;
}

const BookTableHeader = ({ query, setQuery, onSort, sortConfig }: Props) => {
  const isActive = sortConfig?.key === "title";
  const direction = sortConfig?.direction;

  return (
    <div className='flex flex-col gap-6 mb-8'>
      {/* Top Level Title */}
      <div>
        <h1 className='text-2xl text-[#1E293B] font-bold tracking-tight'>
          All Books
        </h1>
      </div>

      {/* Action Bar */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          {/* Create Button - Corrected 'font-mediu' typo */}
          <Link
            href='/admin/books/new'
            className='bg-[#253585] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm shrink-0'
          >
            <Plus className='w-5 h-5' />
            <span>Create a New Book</span>
          </Link>

          {/* A-Z Filter Button */}
          <button
            onClick={onSort}
            type='button'
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all cursor-pointer ${
              isActive
                ? "bg-[#25388C] border-[#25388C]"
                : "bg-white border-slate-200"
            }`}
          >
            <span
              className={`font-semibold text-sm transition-colors ${
                isActive ? "text-white" : "text-[#3A354E]"
              }`}
            >
              A-Z
            </span>
            <SortArrow
              fillColor={isActive ? "white" : "#3A354E"}
              className={`w-4 h-4 transition-transform duration-200 ${
                isActive && direction === "desc" ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </div>

        {/* Search Input - Optimized width for responsiveness */}
        <div className='relative w-full md:max-w-xs group'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#253585] transition-colors' />

          <input
            type='text'
            placeholder='Search by title, author...'
            className='w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 focus:bg-white focus:border-[#253585] focus:ring-4 focus:ring-blue-600/5 transition-all'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer'
              aria-label='Clear search'
            >
              <X className='w-4 h-4' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookTableHeader;
