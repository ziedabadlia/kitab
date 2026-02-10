"use client";

import { useEffect, useState, memo } from "react";
import Image from "next/image";
import { BorrowedBook } from "../types";
import ReceiptHeader from "./ReceiptModal/ReceiptHeader";
import ReceiptBookDetails from "./ReceiptModal/ReceiptBookDetails";
import ReceiptTerms from "./ReceiptModal/ReceiptTerms";
import ReceiptFooter from "./ReceiptModal/ReceiptFooter";

// Import your desired background image or use a public path
import receiptBg from "@/assets/images/receipt.webp";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BorrowedBook | null;
}

const ReceiptModal = ({ isOpen, onClose, book }: ReceiptModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !book) return null;

  const formatDate = (date: string | Date) => {
    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  };

  const receiptId = book.id.substring(0, 5).toUpperCase();

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300'>
      <div
        className='absolute inset-0 bg-black/40 transition-opacity duration-300 cursor-pointer'
        onClick={onClose}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-label='Close receipt modal'
      />

      <div className='relative w-full max-w-md max-h-[90vh] rounded-t-[10px] shadow-2xl flex flex-col z-[9999] animate-in zoom-in-95 duration-300 overflow-hidden bg-transparent'>
        <div className='absolute inset-0 -z-10'>
          <Image
            src={receiptBg}
            alt='Receipt Background'
            fill
            priority
            className='object-cover'
          />
        </div>

        {/* Main Content Area */}
        <div className='p-8 pb-10 text-white relative z-10 overflow-y-auto flex-1'>
          <ReceiptHeader
            receiptId={receiptId}
            dateIssued={formatDate(new Date())}
            onClose={onClose}
          />

          <div className='space-y-6'>
            <ReceiptBookDetails book={book} formatDate={formatDate} />
            <ReceiptTerms />
            <ReceiptFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ReceiptModal);
