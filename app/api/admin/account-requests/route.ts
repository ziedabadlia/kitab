// app/api/admin/account-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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

  const formattedRequests = requests.map((req) => ({
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

  return NextResponse.json({
    requests: formattedRequests,
    totalPages: Math.ceil(totalRequests / pageSize),
    totalRequests,
  });
}
