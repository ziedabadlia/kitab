import Link from "next/link";
import Image from "next/image";
import { Plus, Calendar } from "lucide-react";
import BookCover from "@/components/BookCover";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  coverColor: string;
  categories: string;
  createdAt: string;
}

interface Props {
  books: Book[];
}

export function RecentlyAddedBooks({ books }: Props) {
  return (
    <div className='bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col'>
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-[20px] font-semibold text-[#1E293B]'>
          Recently Added Books
        </h2>
        <Link
          href='/admin/books'
          className='text-[14px] font-semibold text-[#25388C] bg-[#f8f8ff] px-3 py-2 rounded-[6px]'
        >
          View all
        </Link>
      </div>

      {/* Add New Book CTA — always visible, outside the scroll area */}
      <Link
        href='/admin/books/new'
        className='flex items-center gap-3 p-4 mb-3 rounded-[10px] bg-[#F8F8FF] shrink-0'
      >
        <div className='w-8 h-8 rounded-full bg-white group-hover:bg-[#25388C]/10 flex items-center justify-center transition-colors'>
          <Plus className='w-[18px] h-[18px] text-[#1E293B] group-hover:text-[#25388C]' />
        </div>
        <span className='text-[18px] font-medium text-[#1E293B] group-hover:text-[#25388C] transition-colors'>
          Add New Book
        </span>
      </Link>

      {/* Scrollable book list with fade mask */}
      <div className='relative flex-1'>
        <ul className='space-y-1 overflow-y-auto h-[626px] scrollbar-hide'>
          {books.map((book) => (
            <li key={book.id}>
              <Link
                href={`/admin/books/${book.id}`}
                className='flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors'
              >
                {/* Cover */}
                <div className='w-[55px] h-[76px] shrink-0 relative'>
                  <BookCover
                    coverColor={book.coverColor}
                    coverImage={book.coverImageUrl!}
                  />
                </div>

                {/* Info */}
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-slate-800 truncate leading-snug'>
                    {book.title}
                  </p>
                  <p className='text-xs text-slate-400 truncate mt-0.5'>
                    By {book.author}
                    {book.categories && (
                      <span className='text-slate-300'> • </span>
                    )}
                    {book.categories && <span>{book.categories}</span>}
                  </p>
                  <p className='flex items-center gap-1 text-xs text-slate-400 mt-1'>
                    <Calendar className='w-3 h-3' />
                    {book.createdAt}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* White fade mask */}
        {books.length > 5 && (
          <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-xl z-500' />
        )}
      </div>
    </div>
  );
}
