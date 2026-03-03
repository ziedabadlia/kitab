import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TablePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  // If there's only 1 page or no data, you might want to hide pagination
  // or just show it fully disabled. Usually, we hide it or keep it as is.
  if (totalPages <= 1) return null;

  return (
    <div className='mt-6 flex items-center justify-between border-t border-slate-100 pt-6'>
      <p className='text-sm text-slate-500'>
        Page <span className='font-medium text-slate-900'>{currentPage}</span>{" "}
        of <span className='font-medium text-slate-900'>{totalPages}</span>
      </p>

      <div className='flex items-center gap-2'>
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className='p-2 border border-slate-200 rounded-lg transition-colors enabled:hover:bg-slate-50 enabled:cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'
        >
          <ChevronLeft className='w-5 h-5 text-slate-600' />
        </button>

        <div className='flex items-center gap-1'>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? "bg-[#253585] text-white"
                  : "text-slate-600 hover:bg-slate-50 cursor-pointer"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className='p-2 border border-slate-200 rounded-lg transition-colors enabled:hover:bg-slate-50 enabled:cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'
        >
          <ChevronRight className='w-5 h-5 text-slate-600' />
        </button>
      </div>
    </div>
  );
};
