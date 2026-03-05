import { Printer, Download, X } from "lucide-react";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import { useBorrowReceipt } from "../hooks/useBorrowReceipt";
import { BorrowRequest } from "../types";
import ReceiptSkeleton from "./ReceiptSkeleton";

interface BorrowReceiptProps {
  request: BorrowRequest;
  isLateReturn: boolean;
  setIsOpen: (val: boolean) => void;
}

export function BorrowReceipt({
  request,
  isLateReturn,
  setIsOpen,
}: BorrowReceiptProps) {
  const {
    isGeneratingPdf,
    isFetching,
    duration,
    latestRequest,
    handlePrint,
    handleClose,
    handleSavePdf,
  } = useBorrowReceipt({ request, isLateReturn, setIsOpen });

  return (
    <div className='flex flex-col bg-white'>
      {/* Header */}
      <div className='p-6 bg-[#25388C] text-white flex justify-between items-center'>
        <div>
          <h2 className='text-xl font-bold'>Borrowing Receipt</h2>
          <p className='text-xs opacity-80 uppercase tracking-widest mt-1'>
            Transaction ID: {latestRequest.id.slice(-8)}
          </p>
        </div>
        <button
          onClick={handleClose}
          className='cursor-pointer hover:bg-white/10 p-1 rounded transition-colors'
          type='button'
          aria-label='Close receipt'
        >
          <X className='text-white h-5 w-5' />
        </button>
      </div>

      {isFetching ? (
        <ReceiptSkeleton />
      ) : (
        <div className='p-8 space-y-6'>
          {/* Book Section */}
          <div className='flex gap-4'>
            <div className='w-16 h-24 flex-shrink-0'>
              <BookCover
                coverImage={latestRequest.book.coverImageUrl}
                coverColor={latestRequest.book.coverColor}
              />
            </div>
            <div className='flex flex-col justify-center flex-1'>
              <h3 className='font-bold text-slate-900 text-lg leading-tight mb-2'>
                {latestRequest.book.title}
              </h3>
              <div className='space-y-1 text-sm'>
                <div className='flex items-center gap-2'>
                  <span className='text-slate-500'>Author:</span>
                  <span className='font-medium text-slate-700'>
                    {latestRequest.book.author || "Unknown"}
                  </span>
                </div>
                {latestRequest.book.genre && (
                  <div className='flex items-center gap-2'>
                    <span className='text-slate-500'>Genre:</span>
                    <span className='font-medium text-slate-700'>
                      {latestRequest.book.genre}
                    </span>
                  </div>
                )}
                <div className='flex items-center gap-2'>
                  <span className='text-slate-500'>Duration:</span>
                  <span className='font-medium text-slate-700'>{duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className='grid grid-cols-2 gap-y-6 text-sm border-y border-dashed border-slate-200 py-6'>
            <div className='space-y-1'>
              <p className='text-slate-400 font-medium uppercase text-[10px] tracking-wide'>
                Borrower
              </p>
              <p className='text-slate-800 font-semibold'>
                {latestRequest.student.fullName}
              </p>
            </div>
            <div className='space-y-1 text-right'>
              <p className='text-slate-400 font-medium uppercase text-[10px] tracking-wide'>
                Requested Date
              </p>
              <p className='text-slate-800 font-semibold'>
                {latestRequest.requestedAt}
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-slate-400 font-medium uppercase text-[10px] tracking-wide'>
                Borrowed On
              </p>
              <p className='text-slate-800 font-semibold'>
                {latestRequest.borrowedAt || "N/A"}
              </p>
            </div>
            <div className='space-y-1 text-right'>
              <p className='text-slate-400 font-medium uppercase text-[10px] tracking-wide'>
                Due Date
              </p>
              <p className='text-slate-800 font-semibold'>
                {latestRequest.dueDate || "N/A"}
              </p>
            </div>
            <div className='space-y-1 col-span-2'>
              <p className='text-slate-400 font-medium uppercase text-[10px] tracking-wide'>
                Return Date
              </p>
              <p
                className={cn(
                  "font-bold text-base",
                  isLateReturn
                    ? "text-red-600"
                    : latestRequest.returnedAt
                      ? "text-green-600"
                      : "text-slate-400",
                )}
              >
                {latestRequest.returnedAt || "Not yet returned"}
              </p>
            </div>
          </div>

          <div className='text-center py-2'>
            <p className='text-xs text-slate-400 italic'>
              "A book is a gift you can open again and again."
            </p>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className='p-4 bg-slate-50 border-t border-slate-100 flex gap-3'>
        <button
          onClick={handlePrint}
          disabled={isFetching}
          className='flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 transition-all font-medium disabled:opacity-50'
        >
          <Printer size={16} /> Print
        </button>
        <button
          onClick={handleSavePdf}
          disabled={isGeneratingPdf || isFetching}
          className='flex-1 bg-[#25388C] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1a2a6b] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <Download size={16} />
          {isGeneratingPdf ? "Generating..." : "Save PDF"}
        </button>
      </div>
    </div>
  );
}
