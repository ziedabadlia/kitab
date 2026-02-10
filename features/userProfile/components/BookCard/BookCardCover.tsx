"use client";

import { memo } from "react";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import warningSvg from "@/assets/svg/warning.svg";

interface BookCardCoverProps {
  coverImage: string;
  coverColor?: string;
  isOverdue: boolean;
}

const BookCardCover = memo(
  ({ coverImage, coverColor, isOverdue }: BookCardCoverProps) => {
    return (
      <div
        className='relative rounded-2xl p-10 flex items-center justify-center aspect-3/4 overflow-visible shrink-0'
        style={
          {
            backgroundColor: coverColor
              ? `color-mix(in srgb, ${coverColor}, black 20%)`
              : "#1a1d2e",
            "--cover-color": coverColor,
          } as React.CSSProperties
        }
      >
        {isOverdue && (
          <div className='absolute -top-2 -left-2 z-40'>
            <Image
              src={warningSvg}
              alt='Overdue warning'
              width={35}
              height={35}
              className='drop-shadow-lg'
              loading='lazy'
            />
          </div>
        )}

        <BookCover
          coverImage={coverImage}
          coverColor={coverColor}
          className='w-full h-full max-w-48 group-hover:scale-105 transition-transform duration-300'
        />
      </div>
    );
  },
);

BookCardCover.displayName = "BookCardCover";

export default BookCardCover;
