"use client";

import { useSearch } from "@/features/search/contexts/SearchContext";
import notFoundSvg from "../assets/svg/notFound.svg";
import Image from "next/image";

export default function EmptyState() {
  const { query, clearSearch } = useSearch();

  return (
    <div className='flex flex-col items-center justify-center py-0 px-4'>
      <div className='relative mb- w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] lg:w-[280px] lg:h-[280px]'>
        <Image
          src={notFoundSvg}
          fill
          alt='No search results illustration'
          className='object-contain'
          priority
        />
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
        className='font-bebas w-full text-xl sm:w-fit px-12 py-3.5 bg-[#E7C9A5] hover:bg-[#d4b592] text-slate-900 font-bold uppercase tracking-widest rounded-md transition-all duration-200 shadow-lg active:scale-[0.98]'
      >
        Clear Search
      </button>
    </div>
  );
}
