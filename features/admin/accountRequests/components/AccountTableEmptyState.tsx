import { SearchX, Inbox } from "lucide-react";

interface EmptyStateProps {
  hasNoData: boolean;
  urlQuery: string;
  onClear: () => void;
}

export function AccountTableEmptyState({
  hasNoData,
  urlQuery,
  onClear,
}: EmptyStateProps) {
  return (
    <td colSpan={5} className='py-32 text-center'>
      {hasNoData ? (
        <div className='flex flex-col items-center max-w-sm mx-auto'>
          <div className='bg-[#25388C]/10 p-6 rounded-full mb-5'>
            <Inbox size={40} strokeWidth={1.5} className='text-[#25388C]' />
          </div>
          <h3 className='text-lg font-bold text-slate-900'>
            No Pending Requests
          </h3>
          <p className='text-slate-500 mt-2 leading-relaxed'>
            There are no pending account registration requests. New student
            applications will appear here.
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
            onClick={onClear}
            className='mt-4 text-[#25388C] font-medium hover:underline text-sm cursor-pointer'
          >
            Clear search filters
          </button>
        </div>
      )}
    </td>
  );
}
