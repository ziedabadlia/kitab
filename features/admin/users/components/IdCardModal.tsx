"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

export function IdCardModal({ isOpen, imageUrl, onClose }: Props) {
  console.log(imageUrl);
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200'>
      <div className='bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200'>
        <div className='p-4 border-b flex justify-between items-center'>
          <h3 className='font-bold text-lg text-slate-800'>Student ID Card</h3>
          <button
            onClick={onClose}
            className='p-2 hover:bg-slate-100 rounded-full'
          >
            <X className='w-5 h-5 text-slate-400' />
          </button>
        </div>
        <div className='p-6 bg-slate-50 flex justify-center'>
          {/* Aspect Ratio container for the card */}
          <div className='relative w-full aspect-[1.586/1] rounded-xl overflow-hidden shadow-md'>
            <Image src={imageUrl} alt='ID Card' fill className='object-cover' />
          </div>
        </div>
      </div>
    </div>
  );
}
