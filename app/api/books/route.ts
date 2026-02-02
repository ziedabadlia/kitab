import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q");
  const departmentId = searchParams.get("department");
  const categoryId = searchParams.get("category");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const skip = (page - 1) * limit;

  try {
    const whereClause: Prisma.BookWhereInput = {
      AND: [
        query
          ? {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  author: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            }
          : {},
        departmentId ? { departmentId } : {},
        categoryId
          ? {
              categories: {
                some: {
                  categoryId: categoryId,
                },
              },
            }
          : {},
      ],
    };

    // Use Promise.all to run count and findMany in parallel
    const [totalCount, books] = await Promise.all([
      db.book.count({
        where: whereClause,
      }),
      db.book.findMany({
        where: whereClause,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          department: true,
        },
        orderBy: {
          borrowCount: "desc",
        },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      books: JSON.parse(JSON.stringify(books)),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: skip + books.length < totalCount,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 },
    );
  }
}
