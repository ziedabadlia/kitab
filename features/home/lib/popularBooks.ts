import { db } from "@/lib/db";

export async function getPopularBooks() {
  return await db.book.findMany({
    take: 6,
    orderBy: {
      borrowCount: "desc",
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
}
