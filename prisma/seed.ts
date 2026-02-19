import { PrismaClient, BorrowingStatus } from "@prisma/client";
import { addDays, subDays } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding borrowing records...");

  // 1. Get existing data
  const students = await prisma.student.findMany();
  const books = await prisma.book.findMany();

  if (students.length === 0 || books.length === 0) {
    console.error(
      "❌ Seed failed: Ensure you have students and books in the DB first.",
    );
    return;
  }

  const now = new Date();

  const borrowData = [
    {
      studentId: students[0].id,
      bookId: books[0].id,
      status: "BORROWED" as BorrowingStatus,
      borrowedAt: subDays(now, 5),
      dueDate: addDays(now, 9),
    },
    {
      studentId: students[1].id,
      bookId: books[1].id,
      status: "PENDING" as BorrowingStatus,
    },
    {
      studentId: students[0].id,
      bookId: books[2].id,
      status: "RETURNED" as BorrowingStatus,
      borrowedAt: subDays(now, 20),
      returnedAt: subDays(now, 5),
      dueDate: subDays(now, 6),
    },
    {
      studentId: students[2]?.id || students[0].id,
      bookId: books[3]?.id || books[1].id,
      status: "OVERDUE" as BorrowingStatus,
      borrowedAt: subDays(now, 15),
      dueDate: subDays(now, 1),
    },
  ];

  for (const data of borrowData) {
    await prisma.borrowing.create({ data });
  }

  console.log("✅ Seeded borrowing records successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
