import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BorrowingStatus } from "@prisma/client";

const formatDate = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const query = searchParams.get("query") ?? "";
  const sortField = searchParams.get("sort") ?? "createdAt";
  const sortDirection = (searchParams.get("dir") ?? "desc") as "asc" | "desc";
  const skip = (page - 1) * pageSize;

  const where = query
    ? {
        OR: [
          {
            book: { title: { contains: query, mode: "insensitive" as const } },
          },
          {
            student: {
              user: {
                fullName: { contains: query, mode: "insensitive" as const },
              },
            },
          },
          ...(Object.values(BorrowingStatus).some((s) =>
            s.toLowerCase().includes(query.toLowerCase()),
          )
            ? [
                {
                  status: {
                    in: Object.values(BorrowingStatus).filter((s) =>
                      s.toLowerCase().includes(query.toLowerCase()),
                    ),
                  },
                },
              ]
            : []),
        ],
      }
    : {};

  const orderBy =
    sortField === "bookTitle"
      ? { book: { title: sortDirection } }
      : { createdAt: sortDirection };

  const [requests, totalRequests] = await Promise.all([
    db.borrowing.findMany({
      take: pageSize,
      skip,
      where,
      orderBy,
      include: {
        book: { include: { categories: { include: { category: true } } } },
        student: { include: { user: true } },
      },
    }),
    db.borrowing.count({ where }),
  ]);

  const formattedRequests = requests.map((request) => ({
    id: request.id,
    status: request.status,
    book: {
      id: request.book.id,
      title: request.book.title,
      author: request.book.author,
      genre:
        request.book.categories?.map((c) => c.category.name).join(", ") || null,
      coverImageUrl: request.book.coverImageUrl,
      coverColor: request.book.coverColor,
    },
    student: {
      fullName: request.student.user.fullName,
      email: request.student.user.email,
      profilePictureUrl: request.student.user.profilePictureUrl,
    },
    borrowedAt: formatDate(request.borrowedAt),
    returnedAt: formatDate(request.returnedAt),
    dueDate: formatDate(request.dueDate),
    requestedAt:
      formatDate(request.createdAt) ?? request.createdAt.toISOString(),
    rawBorrowedAt: request.borrowedAt?.toISOString() ?? null,
    rawReturnedAt: request.returnedAt?.toISOString() ?? null,
    rawDueDate: request.dueDate?.toISOString() ?? null,
    rawCreatedAt: request.createdAt.toISOString(),
  }));

  return NextResponse.json({
    requests: formattedRequests,
    totalPages: Math.ceil(totalRequests / pageSize),
    totalRequests,
  });
}
