export const formatBorrowStatus = (
  status: string,
  dueDate: string | Date,
  returnedAt?: string | Date | null,
) => {
  const now = new Date();
  const due = new Date(dueDate);

  // RETURNED STATE
  if (status === "RETURNED" && returnedAt) {
    const formattedDate = new Date(returnedAt).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    return `Returned on ${formattedDate}`;
  }

  // OVERDUE STATE
  if (status === "OVERDUE" || due < now) {
    return "Overdue Return";
  }

  const diffInMs = due.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  // WARNING STATE
  if (diffInDays <= 4 && diffInDays >= 0) {
    return `${diffInDays.toString().padStart(2, "0")} days left to due`;
  }

  // DEFAULT ACTIVE STATE
  return "On Time";
};
