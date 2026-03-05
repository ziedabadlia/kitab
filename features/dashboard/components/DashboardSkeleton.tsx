// Pulse shorthand
const P = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />
);

// ── Stat Cards ────────────────────────────────────────────────────────────────
export function StatCardsSkeleton() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className='bg-white rounded-2xl px-7 py-6 flex flex-col gap-3'
        >
          {/* label + delta badge */}
          <div className='flex items-center gap-2'>
            <P className='h-4 w-28' />
            <P className='h-5 w-12 rounded-full' />
          </div>
          {/* big number */}
          <P className='h-8 w-20' />
          {/* growth text */}
          <P className='h-3 w-24' />
        </div>
      ))}
    </div>
  );
}

// ── Borrow Requests ───────────────────────────────────────────────────────────
export function BorrowRequestsSkeleton() {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-5'>
        <div className='space-y-1.5'>
          <P className='h-5 w-36' />
          <P className='h-3 w-24' />
        </div>
        <P className='h-8 w-16 rounded-md' />
      </div>

      {/* Rows */}
      <div className='space-y-3 h-[300px]'>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className='flex items-center gap-3 p-3 rounded-xl bg-[#F8F8FF]'
          >
            {/* book cover */}
            <P className='w-[55px] h-[78px] shrink-0 rounded-md' />

            {/* text block */}
            <div className='flex-1 space-y-2'>
              <P className='h-4 w-3/4' />
              <P className='h-3 w-1/2' />
              <div className='flex items-center gap-2 mt-1'>
                <P className='h-[18px] w-[18px] rounded-full shrink-0' />
                <P className='h-3 w-24' />
                <P className='h-3 w-20' />
              </div>
            </div>

            {/* eye button */}
            <P className='h-8 w-8 rounded-lg shrink-0' />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Account Requests ──────────────────────────────────────────────────────────
export function AccountRequestsSkeleton() {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-5'>
        <div className='space-y-1.5'>
          <P className='h-5 w-40' />
          <P className='h-3 w-28' />
        </div>
        <P className='h-8 w-16 rounded-md' />
      </div>

      {/* 3-column avatar grid */}
      <div className='grid grid-cols-3 gap-3 h-60'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className='flex flex-col items-center gap-2 p-3 rounded-xl'
          >
            <P className='h-12 w-12 rounded-full' />
            <P className='h-4 w-20' />
            <P className='h-3 w-24' />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recently Added Books ──────────────────────────────────────────────────────
export function RecentlyAddedBooksSkeleton() {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between mb-5'>
        <P className='h-5 w-44' />
        <P className='h-8 w-16 rounded-md' />
      </div>

      {/* Add new book CTA placeholder */}
      <div className='flex items-center gap-3 p-4 mb-3 rounded-[10px] bg-[#F8F8FF]'>
        <P className='h-8 w-8 rounded-full shrink-0' />
        <P className='h-5 w-32' />
      </div>

      {/* Book rows */}
      <div className='space-y-1'>
        {[...Array(7)].map((_, i) => (
          <div key={i} className='flex items-center gap-3 p-3 rounded-xl'>
            <P className='w-[55px] h-[76px] shrink-0 rounded-md' />
            <div className='flex-1 space-y-2'>
              <P className='h-4 w-3/4' />
              <P className='h-3 w-1/2' />
              <P className='h-3 w-24' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
