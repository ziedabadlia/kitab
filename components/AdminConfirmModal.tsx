"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: React.ReactNode;
  actionLabel: string;
  variant?: "destructive" | "primary" | "warning";
  isLoading?: boolean;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionLabel,
  variant = "destructive",
  isLoading = false,
}: Props) {
  const variantClasses = {
    destructive: "bg-red-600 hover:bg-red-700 text-white",
    primary: "bg-[#253585] hover:bg-blue-800 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
  };

  const Icon = variant === "destructive" ? AlertTriangle : Info;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[400px]'>
        <div className='flex flex-col items-center text-center p-2'>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              variant === "destructive" ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            <Icon
              className={`w-6 h-6 ${
                variant === "destructive" ? "text-red-600" : "text-blue-600"
              }`}
            />
          </div>
          <DialogTitle className='text-xl font-bold text-slate-900'>
            {title}
          </DialogTitle>
          <DialogDescription className='mt-2 text-slate-500'>
            {description}
          </DialogDescription>
        </div>
        <DialogFooter className='flex gap-2 sm:justify-center mt-4'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='w-full sm:w-auto cursor-pointer'
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto transition-all ${variantClasses[variant]} cursor-pointer`}
          >
            {isLoading ? "Processing..." : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmModal;
