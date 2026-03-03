"use client";

import { Search, X, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { SortConfig, UserSortField } from "../../types/users";

interface Props {
  query: string;
  setQuery: (val: string) => void;
  clearQuery: () => void;
  sortConfig: SortConfig;
  requestSort: (key: UserSortField) => void;
}

export function SortableHeader({
  label,
  sortKey,
  sortConfig,
  requestSort,
}: {
  label: string;
  sortKey: UserSortField;
  sortConfig: SortConfig;
  requestSort: (key: UserSortField) => void;
}) {
  const isActive = sortConfig?.key === sortKey;
  const direction = isActive ? sortConfig!.direction : null;

  // Icon reflects all three states:
  // inactive → ArrowUpDown (grey)
  // asc      → ArrowUp (blue)
  // desc     → ArrowDown (blue)
  const Icon =
    direction === "asc"
      ? ArrowUp
      : direction === "desc"
        ? ArrowDown
        : ArrowUpDown;

  // Tooltip hints at the NEXT action on click
  const title = !isActive
    ? `Sort by ${label} ascending`
    : direction === "asc"
      ? `Sort by ${label} descending`
      : `Reset sort`;

  return (
    <th
      className='px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors select-none'
      onClick={() => requestSort(sortKey)}
      title={title}
    >
      <div className='flex items-center gap-2 font-normal'>
        {label}
        <Icon
          className={`w-3 h-3 transition-all duration-150 ${
            isActive ? "text-[#25388C] opacity-100" : "opacity-30"
          }`}
        />
      </div>
    </th>
  );
}

const TableHeader = ({
  query,
  setQuery,
  clearQuery,
  sortConfig,
  requestSort,
}: Props) => (
  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
    <div>
      <h1 className='text-2xl text-[#1E293B] font-bold tracking-tight'>
        All Users
      </h1>
      <p className='text-sm text-slate-500 mt-1'>
        Manage and view all registered students
      </p>
    </div>

    <div className='relative w-full sm:w-80 group'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#253585] transition-colors' />
      <input
        type='text'
        placeholder='Search by name, email, or ID...'
        className='w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 focus:bg-white focus:border-[#253585] focus:ring-4 focus:ring-blue-600/5 transition-all'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          onClick={clearQuery}
          className='absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer'
          aria-label='Clear search'
        >
          <X className='w-4 h-4' />
        </button>
      )}
    </div>
  </div>
);

export default TableHeader;
