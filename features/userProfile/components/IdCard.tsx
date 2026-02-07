"use client";

import Image from "next/image";
import { Download, RefreshCw } from "lucide-react";

interface Props {
  cardUrl: string | null;
  onGenerateClick: () => void;
}

export default function IdCard({ cardUrl, onGenerateClick }: Props) {
  if (!cardUrl) {
    return (
      <div className='bg-[#1a1d2e] rounded-2xl p-6 border border-slate-700 text-center'>
        <p className='text-slate-400 mb-4'>No ID card generated yet</p>
        <button
          onClick={onGenerateClick}
          className='bg-[#E7C9A5] text-[#05070A] px-6 py-2 rounded-lg font-semibold
                     hover:bg-[#E7C9A5]/90 transition-colors'
        >
          Generate Card
        </button>
      </div>
    );
  }

  return (
    <div className='bg-[#1a1d2e] rounded-2xl p-4 border border-slate-700'>
      <div className='relative rounded-lg overflow-hidden mb-4'>
        <Image
          src={cardUrl}
          alt='Student ID Card'
          width={600}
          height={380}
          className='w-full h-auto'
        />
      </div>

      <div className='flex gap-2'>
        <a
          href={cardUrl}
          download
          className='flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-lg
                     hover:bg-slate-700 transition-colors'
        >
          <Download className='w-4 h-4' />
          Download
        </a>
        <button
          onClick={onGenerateClick}
          className='flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg
                     hover:bg-slate-700 transition-colors'
        >
          <RefreshCw className='w-4 h-4' />
          Regenerate
        </button>
      </div>
    </div>
  );
}
