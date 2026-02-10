"use client";

import { memo } from "react";
import { Download, Printer } from "lucide-react";

const ReceiptActions = memo(() => {
  return (
    <div className='p-6 flex gap-4 bg-[#0F1117] mt-auto'>
      <button
        className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1E2235] hover:bg-[#2A3145] text-white rounded-2xl font-semibold transition-colors active:scale-95'
        aria-label='Download as PDF'
      >
        <Download className='w-4 h-4' />
        PDF
      </button>
      <button
        onClick={() => window.print()}
        className='flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#E7C9A5] hover:bg-[#D4B48D] text-[#0F1117] rounded-2xl font-semibold transition-colors active:scale-95'
        aria-label='Print receipt'
      >
        <Printer className='w-4 h-4' />
        Print
      </button>
    </div>
  );
});

ReceiptActions.displayName = "ReceiptActions";

export default ReceiptActions;
