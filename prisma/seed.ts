// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TARGET_USER_ID = "37a8c2bb-2ebe-4f9b-8b8c-63bd5a9c2e28";

console.log(`\n📖 Seeding borrowings for user: ${TARGET_USER_ID}...`);

async function main() {
  const student = await prisma.student.findUnique({
    where: { userId: TARGET_USER_ID },
  });

  if (!student) {
    console.error(
      "❌ Could not find a Student profile for the provided User ID. Borrowing seed skipped.",
    );
  } else {
    // 2. Get some books to borrow
    const books = await prisma.book.findMany({ take: 5 });

    if (books.length === 0) {
      console.error("❌ No books found in database to borrow.");
    } else {
      for (const book of books) {
        // Calculate dates
        const borrowedAt = new Date();
        borrowedAt.setDate(
          borrowedAt.getDate() - Math.floor(Math.random() * 10),
        ); // 0-10 days ago

        const dueDate = new Date(borrowedAt);
        dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

        await prisma.borrowing.create({
          data: {
            studentId: student.id,
            bookId: book.id,
            status: "ACTIVE",
            borrowedAt: borrowedAt,
            dueDate: dueDate,
          },
        });
      }
      console.log(
        `✅ Successfully seeded ${books.length} borrowed books for the student profile!`,
      );
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
