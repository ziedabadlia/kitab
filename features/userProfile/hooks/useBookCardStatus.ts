import { useMemo } from "react";
import { BorrowingStatus } from "@prisma/client";

export interface BookStatusResult {
  statusLabel: string;
  isOverdue: boolean;
  isOnTime: boolean;
  themeClass: string;
  dotClass: string;
}

type Theme = {
  themeClass: string;
  dotClass: string;
};

const THEMES = {
  green: {
    themeClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    dotClass: "bg-emerald-500 shadow-emerald-500/50",
  },
  gold: {
    themeClass: "bg-[#E7C9A5]/10 border-[#E7C9A5]/20 text-[#E7C9A5]",
    dotClass: "bg-[#E7C9A5] shadow-[#E7C9A5]/50",
  },
  red: {
    themeClass: "bg-red-500/10 border-red-500/20 text-red-400",
    dotClass: "bg-red-500 shadow-red-500/50",
  },
  slate: {
    themeClass: "bg-slate-500/10 border-slate-500/20 text-slate-400",
    dotClass: "bg-slate-500 shadow-slate-500/50",
  },
  blue: {
    themeClass: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    dotClass: "bg-blue-500 shadow-blue-500/50",
  },
  orange: {
    themeClass: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    dotClass: "bg-orange-500 shadow-orange-500/50",
  },
} satisfies Record<string, Theme>;

function getDaysLeft(dueDate: Date | string): number {
  const due = new Date(dueDate);
  const now = new Date();
  due.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function resolveStatus(
  status: BorrowingStatus,
  dueDate: Date | string,
  returnedAt?: Date | string | null,
): { label: string; theme: Theme; isOverdue: boolean; isOnTime: boolean } {
  switch (status) {
    case "PENDING":
      return {
        label: "Pending",
        theme: THEMES.slate,
        isOverdue: false,
        isOnTime: false,
      };

    case "ACCEPTED":
      return {
        label: "Approved",
        theme: THEMES.blue,
        isOverdue: false,
        isOnTime: false,
      };

    case "REJECTED":
      return {
        label: "Rejected",
        theme: THEMES.red,
        isOverdue: false,
        isOnTime: false,
      };

    case "CANCELLED":
      return {
        label: "Cancelled",
        theme: THEMES.slate,
        isOverdue: false,
        isOnTime: false,
      };

    case "LOST":
      return {
        label: "Lost",
        theme: THEMES.orange,
        isOverdue: false,
        isOnTime: false,
      };

    case "OVERDUE":
      return {
        label: "Overdue",
        theme: THEMES.red,
        isOverdue: true,
        isOnTime: false,
      };

    case "RETURNED": {
      const returnedOnTime =
        returnedAt && dueDate
          ? new Date(returnedAt) <= new Date(dueDate)
          : true;
      return {
        label: returnedOnTime ? "Returned On Time" : "Returned Late",
        theme: returnedOnTime ? THEMES.green : THEMES.gold,
        isOverdue: false,
        isOnTime: returnedOnTime,
      };
    }

    case "BORROWED": {
      const daysLeft = getDaysLeft(dueDate);
      if (daysLeft < 0) {
        return {
          label: "Overdue",
          theme: THEMES.red,
          isOverdue: true,
          isOnTime: false,
        };
      }
      if (daysLeft === 0) {
        return {
          label: "Due Today",
          theme: THEMES.gold,
          isOverdue: false,
          isOnTime: false,
        };
      }
      if (daysLeft <= 3) {
        return {
          label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
          theme: THEMES.gold,
          isOverdue: false,
          isOnTime: false,
        };
      }
      return {
        label: "On Time",
        theme: THEMES.green,
        isOverdue: false,
        isOnTime: true,
      };
    }

    default:
      return {
        label: status,
        theme: THEMES.slate,
        isOverdue: false,
        isOnTime: false,
      };
  }
}

export const useBookCardStatus = (
  status: BorrowingStatus,
  dueDate: Date | string,
  returnedAt?: Date | string | null,
): BookStatusResult => {
  return useMemo(() => {
    const { label, theme, isOverdue, isOnTime } = resolveStatus(
      status,
      dueDate,
      returnedAt,
    );
    return {
      statusLabel: label,
      isOverdue,
      isOnTime,
      themeClass: theme.themeClass,
      dotClass: theme.dotClass,
    };
  }, [status, dueDate, returnedAt]);
};
