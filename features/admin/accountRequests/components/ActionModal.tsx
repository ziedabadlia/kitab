"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionLabel: string;
  variant: "approve" | "deny";
  isLoading?: boolean;
}

export function ActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel,
  variant,
  isLoading = false,
}: ActionModalProps) {
  const isApprove = variant === "approve";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isLoading && !open && onClose()}
    >
      {/* We use standard shadcn DialogContent. The default close 'X' is automatically included. */}
      <DialogContent className='max-w-[425px] p-8 flex flex-col items-center text-center rounded-2xl gap-6 bg-white'>
        <DialogHeader className='flex flex-col items-center gap-4 w-full'>
          {/* Circular Icon Design */}
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${
              isApprove ? "bg-[#527A61]/10" : "bg-[#F46B6B]/10"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${
                isApprove ? "bg-[#527A61]" : "bg-[#F46B6B]"
              }`}
            >
              {isApprove ? (
                <CheckCircle2 className='w-8 h-8' strokeWidth={1.5} />
              ) : (
                <AlertCircle className='w-8 h-8' strokeWidth={1.5} />
              )}
            </div>
          </div>

          <div className='space-y-2 w-full flex justify-center flex-col items-center'>
            <DialogTitle className='text-2xl font-semibold text-slate-800'>
              {title}
            </DialogTitle>
            <DialogDescription className='text-base text-slate-500 font-medium leading-relaxed '>
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <button
          onClick={onConfirm}
          disabled={isLoading}
          className={`w-full py-3.5 px-4 rounded-xl text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
            isApprove
              ? "bg-[#527A61] hover:bg-[#43644f]"
              : "bg-[#F46B6B] hover:bg-[#de5b5b]"
          }`}
        >
          {isLoading ? <Loader2 className='w-5 h-5 animate-spin' /> : null}
          {actionLabel}
        </button>
      </DialogContent>
    </Dialog>
  );
}
