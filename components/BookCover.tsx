import Image from "next/image";
import { memo } from "react";
import { cn } from "@/lib/utils";
import BookFrame from "./BookFrame";

interface Props {
  className?: string;
  coverImage: string;
  variant?: "regular" | "hero";
  coverColor?: string;
}

const BookCover = memo(
  ({ coverImage, variant = "regular", coverColor, className }: Props) => {
    return (
      <div className={cn("relative will-change-transform", className)}>
        <div className='relative w-full h-full z-20'>
          <BookFrame coverColor={coverColor!} />
          <div className='absolute z-10 left-[12%] top-[0%] w-[87%] h-[88%] overflow-hidden group'>
            <Image
              src={coverImage}
              alt='Cover'
              fill
              className='object-fill transition-transform duration-300 group-hover:scale-110'
            />
            <div
              className='absolute right-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-200'
              style={
                {
                  background: `linear-gradient(to right, transparent, var(--cover-color))`,
                  "--cover-color": `${coverColor || "#fff"}30`,
                } as React.CSSProperties
              }
            />
          </div>
          <div
            className='absolute bottom-[12%] left-[12%] right-[1%] h-[3px] opacity-60'
            style={
              {
                background: `linear-gradient(to bottom, var(--cover-color), transparent)`,
                "--cover-color": `${coverColor || "#fff"}20`,
              } as React.CSSProperties
            }
          />
        </div>

        {variant === "hero" && (
          <div className='absolute w-full h-full top-[10%] left-10 z-10 rotate-6 blur-[5px] opacity-60'>
            <BookFrame coverColor={coverColor!} />
            <div className='absolute z-10 left-[12%] top-[0%] w-[87%] h-[88%] overflow-hidden'>
              <Image
                src={coverImage}
                alt='Shadow'
                fill
                className='object-fill grayscale opacity-50'
              />
            </div>
          </div>
        )}
      </div>
    );
  },
);

BookCover.displayName = "BookCover";

export default BookCover;
