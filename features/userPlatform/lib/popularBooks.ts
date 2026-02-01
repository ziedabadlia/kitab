import { db } from "@/lib/db";

export const getPopularBooks = async () => {
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
};
