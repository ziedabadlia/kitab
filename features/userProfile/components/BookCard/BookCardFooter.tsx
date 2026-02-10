"use client";

import { memo } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import StatusBadge from "../StatusBadge";
import receiptSvg from "@/assets/svg/receipt.svg";

interface BookCardFooterProps {
  borrowDate: string;
  coverColor?: string;
  statusLabel: string;
  themeClass: string;
  dotClass: string;
  isOnTime: boolean;
  bookId: string;
  onReceiptClick?: (bookId: string) => void;
}

const BookCardFooter = memo(
  ({
    borrowDate,
    coverColor,
    statusLabel,
    themeClass,
    dotClass,
    isOnTime,
    bookId,
    onReceiptClick,
  }: BookCardFooterProps) => {
    return (
      <div className='space-y-4 px-1 mt-auto shrink-0'>
        <div className='flex items-center gap-2 text-base text-slate-300'>
          <Calendar className='w-5 h-5 text-slate-400' aria-hidden='true' />
          <time dateTime={borrowDate}>Borrowed on {borrowDate}</time>
        </div>

        <div className='flex items-center justify-between gap-2'>
          <StatusBadge
            label={statusLabel}
            themeClass={themeClass}
            dotClass={dotClass}
            isOnTime={isOnTime}
          />
          <button
            onClick={() => onReceiptClick?.(bookId)}
            style={
              {
                backgroundColor: `${coverColor}33`,
                "--book-color": coverColor,
              } as React.CSSProperties
            }
            className='p-3 rounded-xl border border-white/5 hover:border-white/10 hover:scale-110 active:scale-95 transition-all shrink-0'
            aria-label='View receipt'
          >
            <Image
              src={receiptSvg}
              alt='Receipt'
              width={24}
              height={24}
              className='brightness-200 '
            />
          </button>
        </div>
      </div>
    );
  },
);

BookCardFooter.displayName = "BookCardFooter";

export default BookCardFooter;
