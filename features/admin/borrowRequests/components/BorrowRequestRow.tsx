import BookCover from "@/components/BookCover";
import { BorrowerCell } from "./BorrowerCell";
import { cn } from "@/lib/utils";
import { BorrowStatusSelect } from "./BorrowStatusSelect";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { BorrowReceipt } from "./BorrowReceipt";
import { useBorrowRequestRow } from "../hooks/useBorrowRequestRow";
import receiptSvg from "@/assets/svg/admin/receipt.svg";
import { BorrowRequest } from "../types";

export function BorrowRequestRow({ request }: { request: BorrowRequest }) {
  const {
    status,
    isUpdating,
    isTerminal,
    isOverdue,
    isLateReturn,
    statusStyles,
    statusOptions,
    isReceiptOpen,
    setIsReceiptOpen,
    handleStatusChange,
    canGenerateReceipt,
  } = useBorrowRequestRow(request);

  return (
    <tr className='hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0'>
      <td className='px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-14 rounded shadow-sm overflow-hidden flex-shrink-0'>
            <BookCover
              coverImage={request.book.coverImageUrl}
              coverColor={request.book.coverColor}
            />
          </div>
          <span className='font-bold text-slate-900 line-clamp-1 text-sm'>
            {request.book.title}
          </span>
        </div>
      </td>

      <td className='px-6 py-4'>
        <BorrowerCell
          name={request.student.fullName}
          avatar={request.student.profilePictureUrl}
        />
      </td>

      <td className='px-6 py-4'>
        {isTerminal ? (
          // Same dimensions as SelectTrigger for visual consistency
          <span
            className={cn(
              "inline-flex items-center h-8 px-3 text-[11px] rounded-full font-bold uppercase tracking-wider border",
              statusStyles.bg,
              statusStyles.text,
              statusStyles.border,
            )}
          >
            {isLateReturn ? "Late Return" : status}
          </span>
        ) : (
          <BorrowStatusSelect
            status={status}
            styles={statusStyles}
            options={statusOptions}
            disabled={isUpdating}
            onChange={handleStatusChange}
          />
        )}
      </td>

      <td className='px-6 py-4 text-slate-500 text-xs'>
        {request.requestedAt}
      </td>
      <td className='px-6 py-4 text-slate-500 text-xs'>
        {request.borrowedAt || "-"}
      </td>

      {/* Returned at — red if late */}
      <td className='px-6 py-4 text-slate-500 text-xs font-bold'>
        <span className={cn(isLateReturn && "text-red-600")}>
          {request.returnedAt || "-"}
        </span>
      </td>

      {/* Due date — red + overdue pill if past due and not yet returned */}
      <td className='px-6 py-4 text-xs'>
        <div className='flex items-center gap-1.5'>
          <span
            className={cn(
              "text-slate-500",
              isOverdue && "text-red-500 font-semibold",
            )}
          >
            {request.dueDate || "-"}
          </span>
        </div>
      </td>

      <td className='px-6 py-4 text-right'>
        <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
          <DialogTrigger asChild>
            <button
              disabled={!canGenerateReceipt}
              className='text-[#25388C] text-xs font-bold bg-[#F8F8FF] py-2 px-3 rounded-lg flex gap-2 ml-auto items-center hover:bg-[#eef0ff] disabled:opacity-30 cursor-pointer'
            >
              <Image src={receiptSvg} height={14} width={14} alt='receipt' />
              Receipt
            </button>
          </DialogTrigger>
          <DialogContent className='max-w-md p-0 border-none'>
            <BorrowReceipt
              setIsOpen={setIsReceiptOpen}
              request={request}
              isLateReturn={isLateReturn || false}
            />
          </DialogContent>
        </Dialog>
      </td>
    </tr>
  );
}
