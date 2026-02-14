export function UserTableSkeleton() {
  return (
    <div className='h-fit bg-white rounded-[14px] p-7 shadow-sm border border-slate-100 animate-pulse'>
      {/* Header Skeleton */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
        <div className='space-y-2'>
          <div className='h-8 w-32 bg-slate-200 rounded-md' />
          <div className='h-4 w-48 bg-slate-100 rounded-md' />
        </div>
        <div className='h-10 w-full sm:w-80 bg-slate-100 rounded-xl' />
      </div>

      {/* Table Skeleton */}
      <div className='overflow-x-auto'>
        <div className='w-full border-b border-slate-100 pb-4 flex gap-6 px-6'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='h-4 w-24 bg-slate-100 rounded' />
          ))}
        </div>
        <div className='divide-y divide-slate-100'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex items-center gap-6 px-6 py-4'>
              <div className='flex items-center gap-3 flex-1'>
                <div className='w-10 h-10 rounded-full bg-slate-200' />
                <div className='space-y-2'>
                  <div className='h-4 w-24 bg-slate-200 rounded' />
                  <div className='h-3 w-32 bg-slate-100 rounded' />
                </div>
              </div>
              <div className='h-4 w-20 bg-slate-100 rounded' />
              <div className='h-4 w-12 bg-slate-100 rounded' />
              <div className='h-4 w-24 bg-slate-100 rounded' />
              <div className='h-8 w-24 bg-slate-100 rounded-md' />
              <div className='h-8 w-8 bg-slate-100 rounded-md' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
