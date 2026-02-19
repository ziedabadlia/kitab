"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { BorrowingStatus } from "@prisma/client";

import BookCover from "@/components/BookCover";
import { BorrowReceipt } from "./BorrowReceipt";
import { useBorrowRequestRow, RowRequest } from "../hooks/useBorrowRequestRow";
import { getAvatarColor, getInitials } from "@/lib/utils/avatar";
import { getStatusStyles } from "../utils/status";
import receiptSvg from "@/assets/svg/admin/receipt.svg";

interface BorrowRequestRowProps {
  request: RowRequest;
}

export function BorrowRequestRow({ request }: BorrowRequestRowProps) {
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
    <tr className='hover:bg-slate-50/50 transition-colors group border-b border-slate-100 last:border-0'>
      {/* Book Column */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div className='relative w-10 h-14 overflow-hidden rounded shadow-sm border border-slate-100 flex-shrink-0'>
            <BookCover
              coverImage={request.book.coverImageUrl}
              coverColor={request.book.coverColor}
            />
          </div>
          <span
            className='font-semibold text-slate-900 line-clamp-1 max-w-[200px]'
            title={request.book.title}
          >
            {request.book.title}
          </span>
        </div>
      </td>

      {/* Student Column */}
      <td className='px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              "w-10 h-10 rounded-full overflow-hidden relative flex items-center justify-center text-white font-medium text-xs border border-white",
              request.student.profilePictureUrl
                ? "bg-slate-200"
                : getAvatarColor(request.student.fullName),
            )}
          >
            {request.student.profilePictureUrl ? (
              <Image
                src={request.student.profilePictureUrl}
                alt={request.student.fullName}
                fill
                className='object-cover'
              />
            ) : (
              <span>{getInitials(request.student.fullName)}</span>
            )}
          </div>
          <span className='font-medium text-slate-700'>
            {request.student.fullName}
          </span>
        </div>
      </td>

      {/* Status Column */}
      <td className='px-6 py-4'>
        {isTerminal ? (
          <Badge
            variant='outline'
            className={cn(
              "capitalize px-2.5 py-1 font-medium text-sm h-8",
              statusStyles.bg,
              statusStyles.text,
              statusStyles.border,
            )}
          >
            {isLateReturn ? "Late Return" : status.toLowerCase()}
          </Badge>
        ) : (
          <Select
            disabled={isUpdating}
            onValueChange={(val) => handleStatusChange(val as BorrowingStatus)}
            value={status}
          >
            <SelectTrigger
              className={cn(
                "h-8 px-2.5 py-0 text-sm transition-all rounded-full font-bold",
                statusStyles.bg,
                statusStyles.text,
                statusStyles.border,
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='rounded-xl border-slate-200'>
              {statusOptions.map((option) => {
                const optionStyle = getStatusStyles(option.value);
                return (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "cursor-pointer p-1 my-2 rounded-lg transition-colors",
                      optionStyle.bg,
                      optionStyle.text,
                      `focus:${optionStyle.bg}`,
                    )}
                  >
                    <span className='font-medium'>{option.label}</span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      </td>

      {/* Dates Columns */}
      <td className='px-6 py-4 text-slate-500 whitespace-nowrap'>
        <span className='text-slate-700 font-medium'>
          {request.requestedAt}
        </span>
      </td>
      <td className='px-6 py-4 text-slate-500'>{request.borrowedAt || "-"}</td>
      <td className='px-6 py-4 text-slate-500'>
        <span className={cn(isLateReturn && "text-red-600 font-bold")}>
          {request.returnedAt || "-"}
        </span>
      </td>
      <td className='px-6 py-4 text-slate-500'>{request.dueDate}</td>

      {/* Action Column */}
      <td className='px-6 py-4 w-full text-right'>
        <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
          <DialogTrigger asChild>
            <button
              disabled={!canGenerateReceipt}
              className='text-[#25388C] font-semibold w-fit bg-[#F8F8FF] py-2 px-3 cursor-pointer rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed flex gap-2 ml-auto items-center hover:bg-[#eef0ff]'
            >
              <Image src={receiptSvg} height={16} width={16} alt='receipt' />
              Generate
            </button>
          </DialogTrigger>
          <DialogContent className='max-w-md bg-slate-50/50 p-0 overflow-hidden border-none [&>button]:hidden'>
            <VisuallyHidden>
              <DialogTitle>Receipt for {request.book.title}</DialogTitle>
              <DialogDescription>
                Transaction details for {request.student.fullName}
              </DialogDescription>
            </VisuallyHidden>

            {/* We cast request to 'any' here if the receipt expects slightly different types, 
                but ideally BorrowReceipt types should match RowRequest */}
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
