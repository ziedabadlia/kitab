"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";
import { BorrowedBook } from "../types";
import BookFrame from "@/components/BookFrame";

export default function BorrowedBooks({ books }: { books: BorrowedBook[] }) {
  return (
    <div className='bg-[#0F1117] rounded-3xl p-8 border border-slate-800/50 min-h-full'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-2xl font-bold text-white'>Borrowed Books</h2>
        <button className='text-[#E7C9A5] text-sm font-medium hover:underline'>
          View All
        </button>
      </div>

      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {books.map((book) => (
          <div key={book.id} className='relative group'>
            <div className='bg-[#161926] rounded-2xl p-4 border border-slate-700/50 flex gap-5 hover:border-[#E7C9A5]/30 transition-all'>
              {/* BOOK COVER WITH SVG FRAME */}
              <div className='relative w-24 h-36 shrink-0'>
                <BookFrame coverColor={book.coverColor} />
                <div className='absolute inset-[3px] rounded-sm overflow-hidden z-0'>
                  {book.coverImageUrl && (
                    <Image
                      src={book.coverImageUrl}
                      alt={book.title}
                      fill
                      className='object-cover'
                    />
                  )}
                </div>
              </div>

              {/* INFO */}
              <div className='flex flex-col justify-between py-1 flex-1 min-w-0'>
                <div>
                  <h3 className='text-white font-bold text-lg truncate leading-tight'>
                    {book.title}
                  </h3>
                  <p className='text-slate-400 text-sm mt-1 italic'>
                    By {book.author}
                  </p>
                </div>

                <div className='mt-4 space-y-2'>
                  <div className='flex items-center gap-2 text-xs text-slate-400'>
                    <Calendar className='w-3.5 h-3.5 text-[#E7C9A5]' />
                    <span>
                      Due Date: {new Date(book.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#05070A]/50 w-fit'>
                    <div className='w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' />
                    <span className='text-emerald-400 text-xs font-medium'>
                      12 Days Left
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
