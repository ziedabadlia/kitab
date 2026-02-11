"use client";

import { memo } from "react";
import BookCover from "@/components/BookCover";
import { Skeleton } from "@/components/ui/skeleton";
import { Prisma } from "@prisma/client";
import BookLink from "@/components/BookLink";

type BookWithCategories = Prisma.BookGetPayload<{
  include: {
    categories: { include: { category: true } };
    department: true;
  };
}>;

interface BookGridProps {
  books: BookWithCategories[];
}

// Memoize individual book card to prevent re-renders
const BookCard = memo(({ book }: { book: BookWithCategories }) => {
  return (
    <div className='flex flex-col items-start gap-3 w-full group'>
      <BookLink id={book.id} title={book.title}>
        <div className='relative w-full aspect-276/384 transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02]'>
          <div className='absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-3 bg-black/50 rounded-full transition-all duration-300 group-hover:w-[90%]' />
          <BookCover
            variant='regular'
            className='w-full aspect-276/384'
            coverImage={book.coverImageUrl!}
            coverColor={book.coverColor}
          />
        </div>
        <div className='space-y-1 mt-2'>
          <h3 className='text-white font-semibold text-sm line-clamp-2'>
            {book.title}
          </h3>
          <p className='text-slate-400 text-xs italic'>By {book.author}</p>
        </div>
      </BookLink>
    </div>
  );
});
BookCard.displayName = "BookCard";

export default function BookGrid({ books }: BookGridProps) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6'>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

// Memoize skeleton too
const SkeletonCard = memo(() => (
  <div className='flex flex-col gap-3'>
    <Skeleton className='w-full aspect-276/384 rounded-lg bg-slate-800/40' />
    <Skeleton className='h-4 w-full bg-slate-800/40' />
    <Skeleton className='h-3 w-2/3 bg-slate-800/40' />
  </div>
));

BookGrid.Skeleton = memo(function BookGridSkeleton() {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6'>
      {[...Array(12)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
});
