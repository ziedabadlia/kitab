"use client";

import { memo } from "react";

const ReceiptTerms = memo(() => {
  return (
    <div className='mt-6 pt-6 border-t border-dashed border-slate-700/50'>
      <h3 className='text-sm font-bold text-white uppercase tracking-wide mb-3'>
        Terms
      </h3>
      <ul className='text-xs text-slate-400 space-y-2'>
        <li className='flex gap-2'>
          <span className='shrink-0'>•</span>
          <span>Please return the book by the due date.</span>
        </li>
        <li className='flex gap-2'>
          <span className='shrink-0'>•</span>
          <span>Lost or damaged books may incur replacement costs.</span>
        </li>
      </ul>
    </div>
  );
});

ReceiptTerms.displayName = "ReceiptTerms";

export default ReceiptTerms;
