export function getStatusStyles(status: string, isLate: boolean = false) {
  // Overriding styles for Late Return scenario
  if (isLate) {
    return {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      label: "Late Return",
    };
  }

  const styles: Record<string, { bg: string; text: string; border: string }> = {
    PENDING: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    ACCEPTED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    BORROWED: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    RETURNED: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
    },
    REJECTED: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    },
    OVERDUE: {
      bg: "bg-rose-100",
      text: "text-rose-900",
      border: "border-rose-300",
    },
    LOST: {
      bg: "bg-zinc-100",
      text: "text-zinc-800",
      border: "border-zinc-300",
    },
    CANCELLED: {
      bg: "bg-gray-50",
      text: "text-gray-600",
      border: "border-gray-200",
    },
  };

  return (
    styles[status] || {
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
    }
  );
}
