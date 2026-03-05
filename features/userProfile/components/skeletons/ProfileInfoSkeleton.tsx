const P = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-slate-800 rounded-lg ${className}`} />
);

export default function ProfileInfoSkeleton() {
  return (
    <div className='space-y-8'>
      {/* Profile Header Card */}
      <div className='bg-[#12141D] rounded-3xl p-8 border border-slate-800 shadow-xl'>
        <div className='flex flex-col items-center text-center'>
          {/* Avatar */}
          <P className='w-24 h-24 rounded-full' />

          {/* Name + badge */}
          <div className='mt-4 flex items-center gap-2'>
            <P className='w-3 h-3 rounded-full' />
            <P className='h-7 w-40' />
          </div>

          {/* Email */}
          <P className='h-4 w-48 mt-2' />

          {/* Verified badge */}
          <P className='h-6 w-32 rounded-full mt-3' />
        </div>

        {/* Details section */}
        <div className='mt-8 space-y-4'>
          <P className='h-3 w-16' />
          <div className='space-y-3'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='flex items-center gap-3 px-1 py-2'>
                <P className='w-4 h-4 rounded shrink-0' />
                <P className='h-4 w-20' />
                <P className='h-4 flex-1 max-w-[180px] ml-auto' />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SmartActionCard placeholder */}
      <P className='h-20 w-full rounded-2xl' />
    </div>
  );
}
