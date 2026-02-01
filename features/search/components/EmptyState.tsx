"use client";

import { useSearch } from "@/features/search/contexts/SearchContext";
import { SearchX } from "lucide-react";

export default function EmptyState() {
  const { query, clearSearch } = useSearch();

  return (
    <div className='flex flex-col items-center justify-center py-20 px-4'>
      <div className='relative mb-6'>
        <div className='absolute inset-0 bg-blue-500/20 blur-3xl rounded-full' />
        <div className='relative w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700'>
          <SearchX className='w-10 h-10 text-slate-400' />
        </div>
      </div>

      <h3 className='text-xl font-semibold text-white mb-2'>
        No Results Found
      </h3>
      <p className='text-slate-400 text-center max-w-md mb-8'>
        We couldn&apos;t find any books matching &quot;
        <span className='text-slate-200'>{query}</span>&quot;. Try using
        different keywords or check for typos.
      </p>

      <button
        onClick={clearSearch}
        className='px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25'
      >
        Clear Search
      </button>
    </div>
  );
}
