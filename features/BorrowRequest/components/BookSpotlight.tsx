"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Lock, Loader2, CheckCheck } from "lucide-react";
import starSvg from "@/assets/svg/star.svg";
import Image from "next/image";
import { Prisma, Role, UserStatus } from "@prisma/client";
import { useBookSpotlight } from "../hooks/useBookSpotlight";
import BookLink from "@/components/BookLink";
import BookCover from "@/components/BookCover";

type BookWithCategories = Prisma.BookGetPayload<{
  include: { categories: { include: { category: true } } };
}>;

interface Props {
  book: BookWithCategories;
  status: UserStatus;
  role: Role;
  showBookLink?: boolean;
}

const BUTTON_CONTENT = {
  suspended: { icon: Lock, label: "Account Pending" },
  noCopies: { icon: BookOpen, label: "No Copies Available" },
  pending: { icon: Loader2, label: "Submitting..." },
  requested: { icon: CheckCheck, label: "Borrow Book Requested" },
  checking: { icon: Loader2, label: "Loading..." },
  default: { icon: BookOpen, label: "Borrow Book Request" },
} as const;

const BookSpotlight = ({ book, status, role, showBookLink = false }: Props) => {
  const {
    categoryName,
    buttonDisabled,
    buttonState,
    handleBorrow,
    isPending,
    isCheckingStatus,
  } = useBookSpotlight({ book, status, role });

  const { icon: Icon, label } = BUTTON_CONTENT[buttonState];
  const isSpinning = isPending || isCheckingStatus;

  return (
    <section className='relative flex flex-col-reverse lg:flex-row items-start justify-between gap-16 lg:gap-8 mt-10 md:mt-20'>
      <div className='flex-1 space-y-5 z-10 w-full'>
        <BookLink id={book.id} title={book.title} enabled={showBookLink}>
          <h1 className='text-5xl md:text-7xl font-bold text-white leading-[1.1] max-w-xl'>
            {book.title}
          </h1>
        </BookLink>

        <div className='flex flex-wrap items-center gap-3 text-slate-300 text-base md:text-lg'>
          <p>
            By{" "}
            <span className='text-[#EED1AC] font-semibold'>{book.author}</span>
          </p>
          <span className='hidden md:block w-1 h-1 bg-slate-500 rounded-full' />
          <p className='text-[#EED1AC] font-semibold'>{categoryName}</p>
          <span className='hidden md:block w-1 h-1 bg-slate-500 rounded-full' />
          <p className='flex items-center gap-1'>
            <Image src={starSvg} alt='star' width={20} height={20} />
            <span className='text-[#E7C9A5] font-semibold'>
              {book.rating}/5
            </span>
          </p>
        </div>

        <div className='flex gap-6 text-slate-300 text-sm md:text-base'>
          <p>
            Total Books:{" "}
            <span className='text-[#EED1AC] font-semibold'>
              {book.totalCopies}
            </span>
          </p>
          <p>
            Available:{" "}
            <span className='text-[#EED1AC] font-semibold'>
              {book.availableCopies}
            </span>
          </p>
        </div>

        <p className='text-slate-400 text-xl md:text-lg max-w-lg leading-relaxed line-clamp-3 md:line-clamp-4'>
          {book.description}
        </p>

        <Button
          onClick={!buttonDisabled ? handleBorrow : undefined}
          disabled={buttonDisabled}
          className='bg-[#E7C9A5] text-[#05070A] hover:bg-[#E7C9A5]/90 px-8 py-6 font-bebas rounded-md uppercase tracking-[1.5px] font-normal text-xl transition-all active:scale-95 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500'
        >
          <Icon
            className={`mr-2 h-5 w-5 ${isSpinning ? "animate-spin" : ""}`}
          />
          {label}
        </Button>
      </div>

      <div className='relative flex-1 flex justify-center items-start w-full lg:w-auto'>
        <BookLink id={book.id} title={book.title} enabled={showBookLink}>
          <BookCover
            className='w-60 h-[330px] md:w-[276px] md:h-96'
            coverImage={book.coverImageUrl!}
            coverColor={book.coverColor}
            variant='hero'
          />
        </BookLink>
      </div>
    </section>
  );
};

export default BookSpotlight;
