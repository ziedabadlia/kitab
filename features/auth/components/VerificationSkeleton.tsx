export default function VerificationSkeleton() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-[#12141D] p-4'>
      <div className='w-full max-w-md bg-[#1a1d2e] rounded-2xl p-8 border border-slate-800 animate-pulse'>
        {/* Title skeleton */}
        <div className='h-8 w-48 bg-slate-700 rounded mx-auto mb-4' />

        {/* Description skeleton */}
        <div className='h-4 w-64 bg-slate-800 rounded mx-auto mb-8' />

        {/* Loading spinner placeholder */}
        <div className='flex justify-center py-6'>
          <div className='w-8 h-8 bg-slate-700 rounded-full' />
        </div>

        {/* Button skeleton */}
        <div className='h-12 w-full bg-slate-700 rounded-lg mt-8' />
      </div>
    </div>
  );
}
