"use client";

import { memo } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import LogoSvg from "@/public/logo.svg";

interface ReceiptHeaderProps {
  receiptId: string;
  dateIssued: string;
  onClose: () => void;
}

const ReceiptHeader = memo(
  ({ receiptId, dateIssued, onClose }: ReceiptHeaderProps) => {
    return (
      <header className='flex flex-col items-start gap-4 border-b border-dashed border-slate-700/50 pb-6 mb-6 relative'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-2'>
            <Image src={LogoSvg} height={40} width={32} alt='logo' />
            <h2 className='text-xl font-bold tracking-tight'>KITAB</h2>
          </div>

          {/* Moved Close Icon here */}
          <button
            onClick={onClose}
            className='p-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white'
            aria-label='Close modal'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='space-y-1 w-full'>
          <p className='text-xl font-bold'>Borrow Receipt</p>
          <p className='text-slate-400 text-sm'>
            Receipt ID:{" "}
            <span className='text-[#E7C9A5] font-mono'>#{receiptId}</span>
          </p>
          <p className='text-slate-400 text-sm'>
            Date Issued: <span className='text-slate-200'>{dateIssued}</span>
          </p>
        </div>
      </header>
    );
  },
);

ReceiptHeader.displayName = "ReceiptHeader";

export default ReceiptHeader;
