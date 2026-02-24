import BookCover from "@/components/BookCover";
import { BorrowerCell } from "./BorrowerCell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BorrowStatusSelect } from "./BorrowStatusSelect";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { BorrowReceipt } from "./BorrowReceipt";
import { RowRequest, useBorrowRequestRow } from "../hooks/useBorrowRequestRow";
import receiptSvg from "@/assets/svg/admin/receipt.svg";

export function BorrowRequestRow({ request }: { request: RowRequest }) {
  const {
    status,
    isUpdating,
    isTerminal,
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
          <Badge
            variant='outline'
            className={cn(
              "uppercase px-2.5 py-1 text-[10px] font-bold",
              statusStyles.bg,
              statusStyles.text,
              statusStyles.border,
            )}
          >
            {isLateReturn ? "Late Return" : status}
          </Badge>
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
      <td className='px-6 py-4 text-slate-500 text-xs font-bold'>
        <span className={cn(isLateReturn && "text-red-600")}>
          {request.returnedAt || "-"}
        </span>
      </td>
      <td className='px-6 py-4 text-slate-500 text-xs'>{request.dueDate}</td>

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
              request={request as any}
              isLateReturn={isLateReturn || false}
            />
          </DialogContent>
        </Dialog>
      </td>
    </tr>
  );
}
