import { ArrowUpDown, Search, X } from "lucide-react";

interface Props {
  query: string;
  setQuery: (val: string) => void;
}

const TableHeader = ({ query, setQuery }: Props) => (
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

      {/* Clear Button */}
      {query && (
        <button
          onClick={() => setQuery("")}
          className='absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer'
          aria-label='Clear search'
        >
          <X className='w-4 h-4' />
        </button>
      )}
    </div>
  </div>
);

export function SortableHeader({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <th
      className='px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors'
      onClick={onClick}
    >
      <div className='flex items-center gap-2 font-normal'>
        {label}
        <ArrowUpDown className='w-3 h-3 opacity-50' />
      </div>
    </th>
  );
}

export default TableHeader;
