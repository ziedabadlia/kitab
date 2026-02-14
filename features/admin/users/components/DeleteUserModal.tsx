// components/admin/users/DeleteUserModal.tsx
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
import { AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  userName?: string | null;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-max-w-[400px]'>
        <div className='flex flex-col items-center text-center p-2'>
          <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4'>
            <AlertTriangle className='text-red-600 w-6 h-6' />
          </div>
          <DialogTitle className='text-xl font-bold text-slate-900'>
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className='mt-2 text-slate-500'>
            Are you sure you want to delete{" "}
            <span className='font-semibold text-slate-900'>
              {userName ?? "this user"}
            </span>
            ?
            <br />
            <span className='text-red-600 font-medium'>
              This action is irreversible.
            </span>
          </DialogDescription>
        </div>
        <DialogFooter className='flex gap-2 sm:justify-center mt-4'>
          <Button
            variant='outline'
            onClick={onClose}
            className='w-full sm:w-auto'
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            className='w-full sm:w-auto bg-red-600 hover:bg-red-700'
          >
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
