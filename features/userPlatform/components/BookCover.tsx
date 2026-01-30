import React from "react";
import Image from "next/image";
import BookFrame from "@/assets/svg/bookFrame.svg";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  coverImage: string;
}

const BookCover = ({ className, coverImage }: Props) => {
  return (
    <div className={cn("relative transition-all duration-300", className)}>
      {/* 1. ATMOSPHERIC GLOW (The soft background light) */}
      <div className='absolute top-[10%] left-[12%] -z-10 w-[80%] h-[80%] opacity-40 blur-[40px]'>
        <Image src={coverImage} alt='glow' fill className='object-cover' />
      </div>

      {/* 2. THE MAIN BOOK STRUCTURE (Sharp) */}
      <div className='relative w-full h-full z-20'>
        <Image
          src={BookFrame}
          alt='Book Frame'
          fill
          className='z-10 object-fill pointer-events-none'
        />

        <div className='absolute z-20 left-[12%] top-[0%] w-[87%] h-[88%] overflow-hidden'>
          <Image
            src={coverImage}
            alt='Book Cover'
            fill
            className='object-fill'
            priority
          />
        </div>
      </div>

      {/* 3. THE SECONDARY BOOK (Blurred & Offset) */}
      {/* Added 'blur-sm' or 'blur-[5px]' to this container */}
      <div className='absolute w-full h-full top-[10%] left-28 z-10 rotate-6 blur-[5px] opacity-80'>
        <Image
          src={BookFrame}
          alt='Book Frame'
          fill
          className='z-0 object-fill pointer-events-none'
        />

        <div className='absolute z-10 left-[12%] top-[0%] w-[87%] h-[88%] overflow-hidden'>
          <Image
            src={coverImage}
            alt='Book Cover Shadow'
            fill
            className='object-fill'
          />
        </div>
      </div>
    </div>
  );
};

export default BookCover;
