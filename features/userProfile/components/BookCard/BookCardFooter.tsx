"use client";

import { memo } from "react";
import Image from "next/image";
import { Calendar, Loader2, X } from "lucide-react";
import StatusBadge from "../StatusBadge";
import receiptSvg from "@/assets/svg/receipt.svg";
import { useCancelBorrowRequest } from "../../hooks/useCancelBorrowRequest";

interface BookCardFooterProps {
  date: string;
  dateLabel: "Requested on" | "Borrowed on";
  canViewReceipt: boolean;
  canCancel: boolean;
  borrowingId: string;
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
    date,
    dateLabel,
    canViewReceipt,
    canCancel,
    borrowingId,
    coverColor,
    statusLabel,
    themeClass,
    dotClass,
    isOnTime,
    bookId,
    onReceiptClick,
  }: BookCardFooterProps) => {
    const { isPending, handleCancel } = useCancelBorrowRequest();

    return (
      <div className='space-y-4 px-1 mt-auto shrink-0'>
        <div className='flex items-center gap-2 text-base text-slate-300'>
          <Calendar className='w-5 h-5 text-slate-400' aria-hidden='true' />
          <time dateTime={date}>
            {dateLabel} {date}
          </time>
        </div>

        <div className='flex items-center justify-between gap-2'>
          <StatusBadge
            label={statusLabel}
            themeClass={themeClass}
            dotClass={dotClass}
            isOnTime={isOnTime}
          />

          {canCancel ? (
            <button
              onClick={() => handleCancel(borrowingId)}
              disabled={isPending}
              className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wide bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 active:scale-95 transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='Cancel borrow request'
            >
              {isPending ? (
                <Loader2 className='w-3.5 h-3.5 animate-spin' />
              ) : (
                <X className='w-3.5 h-3.5' />
              )}
              {isPending ? "Cancelling..." : "Cancel"}
            </button>
          ) : canViewReceipt ? (
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
                className='brightness-200'
              />
            </button>
          ) : (
            <div className='w-[48px]' />
          )}
        </div>
      </div>
    );
  },
);

BookCardFooter.displayName = "BookCardFooter";

export default BookCardFooter;
