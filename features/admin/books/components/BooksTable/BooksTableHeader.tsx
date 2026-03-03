"use client";

import { Search, X, Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  query: string;
  setQuery: (val: string) => void;
  clearQuery: () => void;
}

const BookTableHeader = ({ query, setQuery, clearQuery }: Props) => {
  return (
    <div className='flex flex-col gap-6 mb-8'>
      <div>
        <h1 className='text-2xl text-[#1E293B] font-bold tracking-tight'>
          All Books
        </h1>
      </div>

      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Link
            href='/admin/books/new'
            className='bg-[#253585] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm shrink-0'
          >
            <Plus className='w-5 h-5' />
            <span>Create a New Book</span>
          </Link>
        </div>

        <div className='relative w-full md:max-w-xs group'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#253585] transition-colors' />
          <input
            type='text'
            placeholder='Search by title, author or genre...'
            className='w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 focus:bg-white focus:border-[#253585] focus:ring-4 focus:ring-blue-600/5 transition-all'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={clearQuery}
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
