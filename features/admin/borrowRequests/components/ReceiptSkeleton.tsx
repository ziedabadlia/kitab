const P = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-slate-100 rounded ${className}`} />
);

export default function ReceiptSkeleton() {
  return (
    <div className='p-8 space-y-6'>
      {/* Book section */}
      <div className='flex gap-4'>
        <P className='w-16 h-24 shrink-0 rounded-md' />
        <div className='flex flex-col justify-center flex-1 space-y-2'>
          <P className='h-5 w-3/4' />
          <P className='h-4 w-1/2' />
          <P className='h-4 w-1/3' />
          <P className='h-4 w-1/4' />
        </div>
      </div>

      {/* Info grid */}
      <div className='grid grid-cols-2 gap-y-6 text-sm border-y border-dashed border-slate-200 py-6'>
        <div className='space-y-1.5'>
          <P className='h-2.5 w-16' />
          <P className='h-4 w-28' />
        </div>
        <div className='space-y-1.5 flex flex-col items-end'>
          <P className='h-2.5 w-24' />
          <P className='h-4 w-24' />
        </div>
        <div className='space-y-1.5'>
          <P className='h-2.5 w-20' />
          <P className='h-4 w-24' />
        </div>
        <div className='space-y-1.5 flex flex-col items-end'>
          <P className='h-2.5 w-16' />
          <P className='h-4 w-24' />
        </div>
        <div className='space-y-1.5 col-span-2'>
          <P className='h-2.5 w-20' />
          <P className='h-5 w-32' />
        </div>
      </div>

      {/* Quote */}
      <div className='flex justify-center py-2'>
        <P className='h-3 w-56' />
      </div>
    </div>
  );
}
