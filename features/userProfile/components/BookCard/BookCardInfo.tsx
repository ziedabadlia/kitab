"use client";

import { memo } from "react";

interface BookCardInfoProps {
  title: string;
  categories: string;
}

const BookCardInfo = memo(({ title, categories }: BookCardInfoProps) => {
  return (
    <div className='space-y-2 px-1 flex-1'>
      <h3 className='text-white font-bold text-xl leading-snug wrap-break-word'>
        {title}
      </h3>
      <p className='text-slate-400 text-base italic wrap-break-word line-clamp-2'>
        {categories}
      </p>
    </div>
  );
});

BookCardInfo.displayName = "BookCardInfo";

export default BookCardInfo;
