import Image from "next/image";

function SimilarBookCard({ book }: { book: any }) {
  return (
    <div className='group cursor-pointer transition-transform hover:-translate-y-2'>
      <div className='relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl border border-white/5'>
        <Image
          src={book.coverImageUrl}
          fill
          alt={book.title}
          className='object-cover'
        />
        {/* Optional: Add the "3D page stack" effect on the side */}
        <div className='absolute inset-y-0 right-0 w-1 bg-white/20 blur-[1px]' />
      </div>
    </div>
  );
}
