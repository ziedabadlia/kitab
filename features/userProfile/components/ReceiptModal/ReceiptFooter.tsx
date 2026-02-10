"use client";

import { memo } from "react";

const ReceiptFooter = memo(() => {
  return (
    <div className='mt-2 pb-4'>
      <p className='text-xs text-slate-400 leading-relaxed space-y-1'>
        <span className='block'>
          Thank you for using{" "}
          <span className='font-bold text-white'>KITAB</span>!
        </span>
        <span className='block'>Website: www.kitab.io</span>
        <span className='block'>Email: support@KITAB.com</span>
      </p>
    </div>
  );
});

ReceiptFooter.displayName = "ReceiptFooter";

export default ReceiptFooter;
