"use client";

import { useState } from "react";
import { X, AlertCircle, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementProps {
  message: string;
  variant?: "warning" | "info" | "danger";
}

const Announcement = ({ message, variant = "info" }: AnnouncementProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-lg border mb-6 transition-all animate-in fade-in slide-in-from-top-2",
        variant === "warning" &&
          "bg-amber-500/10 border-amber-500/20 text-amber-500",
        variant === "danger" && "bg-red-500/10 border-red-500/20 text-red-500",
        variant === "info" && "bg-blue-500/10 border-blue-500/20 text-blue-400",
      )}
    >
      <div className='flex items-center gap-3'>
        {variant === "warning" ? (
          <AlertCircle className='h-5 w-5' />
        ) : (
          <Megaphone className='h-5 w-5' />
        )}
        <p className='text-sm font-medium'>{message}</p>
      </div>

      <button
        onClick={() => setIsVisible(false)}
        className='p-1 hover:bg-white/10 rounded-full transition-colors'
        aria-label='Close announcement'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  );
};

export default Announcement;
