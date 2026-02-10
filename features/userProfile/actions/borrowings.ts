import { db } from "@/lib/db";

export async function getStudentBorrowings(studentId: string) {
  const now = new Date();

  const borrowings = await db.borrowing.findMany({
    where: { studentId },
    include: {
      book: {
        include: {
          categories: { include: { category: true } },
        },
      },
    },
  });

  // 2. Check for "Ghost Overdue" (Non-blocking hot-fix)
  const needsFix = borrowings.some(
    (b) => b.status === "ACTIVE" && b.dueDate < now,
  );

  if (needsFix) {
    db.borrowing
      .updateMany({
        where: {
          studentId,
          status: "ACTIVE",
          dueDate: { lt: now },
        },
        data: { status: "OVERDUE" },
      })
      .catch(console.error);
  }

  return borrowings;
}
