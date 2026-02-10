"use client";

import { memo } from "react";

interface StatusBadgeProps {
  label: string;
  themeClass: string;
  dotClass: string;
  isOnTime: boolean;
}

const StatusBadge = memo(
  ({ label, themeClass, dotClass, isOnTime }: StatusBadgeProps) => (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg w-fit border transition-colors ${themeClass}`}
      role='status'
      aria-label={`Book status: ${label}`}
    >
      <div
        className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px] ${dotClass} ${
          isOnTime ? "animate-pulse-dot" : ""
        }`}
        aria-hidden='true'
      />
      <span className='text-xs font-bold uppercase tracking-wider whitespace-nowrap'>
        {label}
      </span>
    </div>
  ),
);

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;
