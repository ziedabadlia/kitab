"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { formatDate } from "../constants";
import {
  GetAccountRequestsParams,
  GetAccountRequestsResponse,
  AccountRequest,
} from "../types";
import {
  sendApprovalEmail,
  sendRejectionEmail,
} from "@/lib/emails/getKitabTemplate/senders/account";

export async function getAccountRequests({
  page = 1,
  pageSize = 10,
  query = "",
  sortField = "createdAt",
  sortDirection = "desc",
}: GetAccountRequestsParams = {}): Promise<GetAccountRequestsResponse> {
  const skip = (page - 1) * pageSize;

  const where = query
    ? {
        status: "SUSPENDED" as const,
        OR: [
          {
            user: {
              fullName: { contains: query, mode: "insensitive" as const },
            },
          },
          {
            user: { email: { contains: query, mode: "insensitive" as const } },
          },
          {
            studentIdNumber: { contains: query, mode: "insensitive" as const },
          },
        ],
      }
    : { status: "SUSPENDED" as const };

  const orderBy = { [sortField]: sortDirection };

  const [requests, totalRequests] = await Promise.all([
    db.student.findMany({
      take: pageSize,
      skip,
      where,
      orderBy,
      select: {
        id: true,
        studentIdNumber: true,
        universityName: true,
        universityIdCardUrl: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            fullName: true,
            email: true,
            profilePictureUrl: true,
          },
        },
      },
    }),
    db.student.count({ where }),
  ]);

  const formattedRequests: AccountRequest[] = requests.map((req) => ({
    id: req.id,
    studentIdNumber: req.studentIdNumber,
    universityName: req.universityName,
    universityIdCardUrl: req.universityIdCardUrl,
    status: req.status,
    dateJoined: formatDate(req.createdAt),
    rawCreatedAt: req.createdAt.toISOString(),
    student: {
      fullName: req.user.fullName,
      email: req.user.email,
      profilePictureUrl: req.user.profilePictureUrl,
    },
  }));

  return {
    requests: formattedRequests,
    totalPages: Math.ceil(totalRequests / pageSize),
    totalRequests,
  };
}

export async function approveAccountRequest(studentId: string) {
  const student = await db.student.update({
    where: { id: studentId },
    data: { status: "ACCEPTED" },
    include: { user: true },
  });

  try {
    await sendApprovalEmail(student.user.email, student.user.fullName);
  } catch (err) {
    console.error("Approval email failed:", err);
  }

  revalidatePath("/admin/account-requests");
}

export async function denyAccountRequest(studentId: string) {
  // Fetch user info before deletion to send the rejection email
  const student = await db.student.findUnique({
    where: { id: studentId },
    include: { user: { select: { id: true, email: true, fullName: true } } },
  });

  if (!student) return;

  // Deleting the User cascades to Student, notifications, borrowings, etc.
  await db.user.delete({ where: { id: student.user.id } });

  try {
    await sendRejectionEmail(student.user.email, student.user.fullName);
  } catch (err) {
    console.error("Rejection email failed:", err);
  }

  revalidatePath("/admin/account-requests");
}
