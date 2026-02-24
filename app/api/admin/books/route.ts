import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const search = searchParams.get("search") ?? "";
  const skip = (page - 1) * pageSize;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { author: { contains: search, mode: "insensitive" as const } },
          {
            department: {
              name: { contains: search, mode: "insensitive" as const },
            },
          },
          {
            categories: {
              some: {
                category: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            },
          },
        ],
      }
    : {};

  const [totalBooks, books] = await Promise.all([
    db.book.count({ where }),
    db.book.findMany({
      where,
      include: {
        department: true,
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  const formattedBooks = books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.categories.map((c) => c.category.name).join(", "),
    department: book.department.name,
    coverImageUrl: book.coverImageUrl,
    coverColor: book.coverColor,
    createdAt: book.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  }));

  return NextResponse.json({
    books: formattedBooks,
    totalPages: Math.ceil(totalBooks / pageSize),
    totalBooks,
  });
}
