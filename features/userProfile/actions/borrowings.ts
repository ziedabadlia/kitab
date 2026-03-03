import { db } from "@/lib/db";

export async function getStudentBorrowings(studentId: string) {
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

  return borrowings;
}
