"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IdCardModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fullName: string;
  idCardUrl: string | null;
}

export function IdCardModal({
  isOpen,
  onOpenChange,
  fullName,
  idCardUrl,
}: IdCardModalProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setHasError(false);
      }}
    >
      <DialogContent className='max-w-3xl bg-white p-6 rounded-2xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-slate-900'>
            ID Card Verification
          </DialogTitle>
          <p className='text-sm text-slate-500 mt-1'>
            Document provided by {fullName}
          </p>
        </DialogHeader>

        <div className='relative w-full h-[60vh] mt-4 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center'>
          {!idCardUrl || hasError ? (
            <div className='flex flex-col items-center gap-3 text-slate-400'>
              <ImageOff className='w-10 h-10' />
              <p className='text-sm'>
                {!idCardUrl
                  ? "No ID card image provided."
                  : "Failed to load ID card image."}
              </p>
            </div>
          ) : (
            <Image
              src={idCardUrl}
              alt={`${fullName}'s ID Card`}
              fill
              className='object-contain'
              unoptimized
              onError={() => setHasError(true)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
