"use server";

import { db } from "@/lib/db";
import { BorrowingStatus, Prisma } from "@prisma/client";
import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";

// --- Types --------------------------------------------------------------------

export type BorrowSortField = "createdAt" | "bookTitle";
export type SortDirection = "asc" | "desc";

export interface BorrowRequest {
  id: string;
  status: BorrowingStatus;
  borrowedAt: string | null;
  returnedAt: string | null;
  dueDate: string | null;
  requestedAt: string;
  rawBorrowedAt: string | null;
  rawReturnedAt: string | null;
  rawDueDate: string | null;
  rawCreatedAt: string;
  book: {
    id: string;
    title: string;
    author: string;
    genre: string | null;
    coverImageUrl: string;
    coverColor: string;
  };
  student: {
    fullName: string;
    email: string;
    profilePictureUrl: string | null;
  };
}

export interface GetBorrowingRequestsResponse {
  requests: BorrowRequest[];
  totalPages: number;
  totalRequests: number;
}

export interface GetBorrowingRequestsParams {
  page?: number;
  pageSize?: number;
  query?: string;
  sortField?: BorrowSortField;
  sortDirection?: SortDirection;
}

// --- Helpers ------------------------------------------------------------------

const formatDate = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const TERMINAL_STATES: BorrowingStatus[] = [
  "RETURNED",
  "REJECTED",
  "CANCELLED",
  "LOST",
];

// --- Actions ------------------------------------------------------------------

export async function getBorrowingRequests({
  page = 1,
  pageSize = 10,
  query = "",
  sortField = "createdAt",
  sortDirection = "desc",
}: GetBorrowingRequestsParams = {}): Promise<GetBorrowingRequestsResponse> {
  const skip = (page - 1) * pageSize;

  const where: Prisma.BorrowingWhereInput = query
    ? {
        OR: [
          { book: { title: { contains: query, mode: "insensitive" } } },
          {
            student: {
              user: { fullName: { contains: query, mode: "insensitive" } },
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
        book: {
          include: {
            categories: { include: { category: true } },
          },
        },
        student: {
          include: { user: true },
        },
      },
    }),
    db.borrowing.count({ where }),
  ]);

  const formattedRequests: BorrowRequest[] = requests.map((request) => ({
    id: request.id,
    status: request.status,
    book: {
      id: request.book.id,
      title: request.book.title,
      author: request.book.author,
      genre:
        request.book.categories?.map((c) => c.category.name).join(", ") || null,
      coverImageUrl: request.book.coverImageUrl!,
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

  return {
    requests: formattedRequests,
    totalPages: Math.ceil(totalRequests / pageSize),
    totalRequests,
  };
}

export async function updateBorrowingStatus(
  borrowingId: string,
  newStatus: BorrowingStatus,
) {
  const now = new Date();
  const updateData: Prisma.BorrowingUpdateInput = { status: newStatus };

  if (newStatus === "ACCEPTED") {
    updateData.borrowedAt = now;
    updateData.dueDate = addDays(now, 9);
  } else if (newStatus === "RETURNED") {
    updateData.returnedAt = now;
  }

  const result = await db.borrowing.updateMany({
    where: { id: borrowingId, status: { notIn: TERMINAL_STATES } },
    data: updateData,
  });

  if (result.count === 0) {
    throw new Error("Cannot update: record not found or already terminal.");
  }

  revalidatePath("/admin/borrow-requests");
}
