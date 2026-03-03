import { db } from "@/lib/db";

export async function getBookByIdAction(id: string) {
  try {
    const book = await db.book.findUnique({
      where: { id },
      include: {
        department: true,
        categories: {
          include: { category: true },
        },
      },
    });

    if (!book) return null;

    return {
      ...book,
      genre: book.categories.map((c) => c.category.name).join(", "),
      createdAt: book.createdAt.toLocaleDateString("en-GB"),
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}
