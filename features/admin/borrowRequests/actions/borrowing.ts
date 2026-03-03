"use server";

import { db } from "@/lib/db";
import { BorrowingStatus, Prisma } from "@prisma/client";
import { addDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { formatDate, TERMINAL_STATES } from "../constants";
import {
  BorrowRequest,
  GetBorrowingRequestsParams,
  GetBorrowingRequestsResponse,
} from "../types";
import {
  sendBorrowConfirmationEmail,
  sendBorrowRejectedEmail,
  sendBorrowRequestApprovedEmail,
} from "@/lib/emails/getKitabTemplate/senders/borrowing";
import { createNotification } from "@/features/notifications/actions/notifications";

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
        book: { include: { categories: { include: { category: true } } } },
        student: { include: { user: true } },
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

  if (newStatus === "BORROWED") {
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

  // Send approval email when borrow request is accepted
  if (newStatus === "ACCEPTED") {
    try {
      const borrowing = await db.borrowing.findUnique({
        where: { id: borrowingId },
        include: {
          book: { select: { title: true, author: true } },
          student: {
            select: {
              id: true,
              user: { select: { email: true, fullName: true } },
            },
          },
        },
      });
      if (borrowing) {
        await Promise.allSettled([
          sendBorrowRequestApprovedEmail(
            borrowing.student.user.email,
            borrowing.student.user.fullName,
            borrowing.book.title,
            borrowing.book.author,
          ),
          createNotification(
            borrowing.student.id,
            `Your borrow request for "${borrowing.book.title}" has been approved! Please collect it within 3 days.`,
          ),
        ]);
      }
    } catch (err) {
      console.error("ACCEPTED notification failed:", err);
    }
  }

  // Send confirmation email when book is marked as borrowed
  if (newStatus === "BORROWED") {
    try {
      const borrowing = await db.borrowing.findUnique({
        where: { id: borrowingId },
        include: {
          book: { select: { title: true } },
          student: {
            select: {
              id: true,
              user: { select: { email: true, fullName: true } },
            },
          },
        },
      });
      if (borrowing?.borrowedAt && borrowing?.dueDate) {
        const dueDateStr = borrowing.dueDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        await Promise.allSettled([
          sendBorrowConfirmationEmail(
            borrowing.student.user.email,
            borrowing.student.user.fullName,
            borrowing.book.title,
            borrowing.borrowedAt,
            borrowing.dueDate,
          ),
          createNotification(
            borrowing.student.id,
            `You have borrowed "${borrowing.book.title}". Please return it by ${dueDateStr}.`,
          ),
        ]);
      }
    } catch (err) {
      console.error("BORROWED notification failed:", err);
    }
  }

  // Send rejection email when borrow request is rejected
  if (newStatus === "REJECTED") {
    try {
      const borrowing = await db.borrowing.findUnique({
        where: { id: borrowingId },
        include: {
          book: { select: { title: true } },
          student: {
            include: { user: { select: { email: true, fullName: true } } },
          },
        },
      });

      if (borrowing) {
        await sendBorrowRejectedEmail(
          borrowing.student.user.email,
          borrowing.student.user.fullName,
          borrowing.book.title,
        );
      }
    } catch (err) {
      console.error("Borrow rejection email failed:", err);
    }
  }

  revalidatePath("/admin/borrow-requests");
}
