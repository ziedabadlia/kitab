const P = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-slate-800 rounded-lg ${className}`} />
);

function BookCardSkeleton() {
  return (
    <div className='bg-[#0F1117] rounded-3xl p-7 border border-slate-800/50 flex flex-col gap-5 h-full'>
      {/* Cover */}
      <P className='w-full aspect-[3/4] max-w-[120px] mx-auto rounded-2xl' />

      {/* Title + category */}
      <div className='space-y-2'>
        <P className='h-5 w-3/4' />
        <P className='h-4 w-1/2' />
      </div>

      {/* Footer */}
      <div className='mt-auto space-y-3'>
        {/* Status badge */}
        <P className='h-6 w-24 rounded-full' />
        {/* Date */}
        <P className='h-4 w-32' />
        {/* Buttons */}
        <div className='flex gap-2 pt-1'>
          <P className='h-9 flex-1 rounded-xl' />
          <P className='h-9 flex-1 rounded-xl' />
        </div>
      </div>
    </div>
  );
}

export default function BorrowedBooksSkeleton() {
  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <div className='animate-pulse bg-slate-800 rounded-lg h-6 w-36' />
        <div className='animate-pulse bg-slate-800 rounded-full h-5 w-8' />
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
        {[...Array(6)].map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
