import Image from "next/image";
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          {idCardUrl ? (
            <Image
              src={idCardUrl}
              alt={`${fullName}'s ID Card`}
              fill
              className='object-contain'
              unoptimized
            />
          ) : (
            <p className='text-slate-400 text-sm'>No ID card image provided.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
