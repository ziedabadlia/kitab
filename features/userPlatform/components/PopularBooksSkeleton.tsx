import { Skeleton } from "@/components/ui/skeleton";

const PopularBooksSkeleton = () => (
  <section className='mt-20 space-y-8'>
    <h2 className='font-bebas text-4xl text-white/50'>Popular Books</h2>
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8'>
      {[...Array(6)].map((_, i) => (
        <div key={i} className='flex flex-col gap-3 w-full'>
          <Skeleton className='w-full aspect-276/384 rounded-lg bg-slate-800/40' />
          <div className='space-y-2 mt-2'>
            <Skeleton className='h-4 w-full bg-slate-800/40 rounded' />
            <Skeleton className='h-3 w-2/3 bg-slate-800/40 rounded' />
            <Skeleton className='h-2 w-1/2 bg-slate-800/40 rounded' />
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default PopularBooksSkeleton;
