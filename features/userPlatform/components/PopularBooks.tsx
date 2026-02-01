"use client";
import BookCover from "./BookCover";
import { Prisma } from "@prisma/client";

type BookWithCategories = Prisma.BookGetPayload<{
  include: {
    categories: {
      include: {
        category: true;
      };
    };
  };
}>;

interface Props {
  books?: BookWithCategories[];
}

const PopularBooks = ({ books }: Props) => {
  return (
    <section className='mt-20 space-y-8'>
      <h2 className='text-3xl font-semibold text-white tracking-wide'>
        Popular Books
      </h2>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8'>
        {books?.map((book) => (
          <div
            key={book.id}
            className='flex flex-col items-start gap-3 w-full group'
          >
            <div className='relative w-full aspect-276/384 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] will-change-transform'>
              <div className='absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-3 bg-black/50 rounded-[100%] transition-all duration-300 group-hover:w-[90%] group-hover:bg-black/70 group-hover:translate-y-2 will-change-transform' />

              <div className='absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg bg-linear-to-tr from-transparent via-white/10 to-transparent' />

              <BookCover
                variant='regular'
                className='w-full aspect-276/384 relative z-20'
                coverImage={book.coverImageUrl!}
                coverColor={book.coverColor}
              />
            </div>

            <div className='space-y-1 mt-2 w-full transition-opacity duration-300 group-hover:opacity-90'>
              <h3 className='text-white font-semibold text-sm md:text-base line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors duration-300'>
                {book.title}
              </h3>
              <p className='text-slate-400 text-xs md:text-sm italic line-clamp-1'>
                By {book.author || "Unknown Author"}
              </p>
              <p className='text-slate-500 text-xs uppercase tracking-wider'>
                {book.categories?.[0]?.category?.name || "General"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularBooks;
