import { Printer, Download, X } from "lucide-react";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import { useBorrowReceipt, BorrowRequest } from "../hooks/useBorrowReceipt";

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
  const { isGeneratingPdf, duration, handlePrint, handleClose, handleSavePdf } =
    useBorrowReceipt({ request, isLateReturn, setIsOpen });

  return (
    <div className='flex flex-col bg-white'>
      {/* Header Info */}
      <div className='p-6 bg-[#25388C] text-white flex justify-between items-center'>
        <div>
          <h2 className='text-xl font-bold'>Borrowing Receipt</h2>
          <p className='text-xs opacity-80 uppercase tracking-widest mt-1'>
            Transaction ID: {request.id.slice(-8)}
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

      <div className='p-8 space-y-6 relative'>
        {/* Book Section */}
        <div className='flex gap-4'>
          <div className='w-16 h-24 flex-shrink-0'>
            <BookCover
              coverImage={request.book.coverImageUrl}
              coverColor={request.book.coverColor}
            />
          </div>
          <div className='flex flex-col justify-center flex-1'>
            <h3 className='font-bold text-slate-900 text-lg leading-tight mb-2'>
              {request.book.title}
            </h3>

            {/* Book Details List */}
            <div className='space-y-1 text-sm'>
              <div className='flex items-center gap-2'>
                <span className='text-slate-500'>Author:</span>
                <span className='font-medium text-slate-700'>
                  {request.book.author || "Unknown"}
                </span>
              </div>
              {request.book.genre && (
                <div className='flex items-center gap-2'>
                  <span className='text-slate-500'>Genre:</span>
                  <span className='font-medium text-slate-700'>
                    {request.book.genre}
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
              {request.student.fullName}
            </p>
          </div>
          <div className='space-y-1 text-right'>
            <p className='text-slate-400 font-medium uppercase text-[10px] tracking-wide'>
              Requested Date
            </p>
            <p className='text-slate-800 font-semibold'>
              {request.requestedAt}
            </p>
          </div>
          <div className='space-y-1'>
            <p className='text-slate-400 font-medium uppercase text-[10px] tracking-wide'>
              Borrowed On
            </p>
            <p className='text-slate-800 font-semibold'>
              {request.borrowedAt || "N/A"}
            </p>
          </div>
          <div className='space-y-1 text-right'>
            <p className='text-slate-400 font-medium uppercase text-[10px] tracking-wide'>
              Due Date
            </p>
            <p className='text-slate-800 font-semibold'>
              {request.dueDate || "N/A"}
            </p>
          </div>
          <div className='space-y-1 col-span-2'>
            <p className='text-slate-400 font-medium uppercase text-[10px] tracking-wide'>
              Return Date
            </p>
            <div className='flex'>
              <p
                className={cn(
                  "font-bold text-base",
                  isLateReturn
                    ? "text-red-600"
                    : request.returnedAt
                      ? "text-green-600"
                      : "text-slate-400",
                )}
              >
                {request.returnedAt || "Not yet returned"}
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Footer Message */}
        <div className='text-center space-y-1 py-2'>
          <p className='text-xs text-slate-400 italic'>
            "A book is a gift you can open again and again."
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className='p-4 bg-slate-50 border-t border-slate-100 flex gap-3'>
        <button
          onClick={handlePrint}
          className='flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-100 transition-all font-medium'
        >
          <Printer size={16} /> Print
        </button>
        <button
          onClick={handleSavePdf}
          disabled={isGeneratingPdf}
          className='flex-1 bg-[#25388C] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1a2a6b] transition-all font-medium disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
        >
          <Download size={16} />
          {isGeneratingPdf ? "Generating..." : "Save PDF"}
        </button>
      </div>
    </div>
  );
}
