"use server";

import { db } from "@/lib/db";

const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(1));
};

export async function getDashboardStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    usersYesterdayTotal,
    totalBooks,
    booksYesterdayTotal,
    borrowedNow,
    borrowedYesterdayTotal,
    pendingBorrowRequests,
    pendingAccountRequests,
  ] = await Promise.all([
    db.student.count({ where: { status: "ACCEPTED" } }),
    db.student.count({
      where: { status: "ACCEPTED", createdAt: { lt: todayStart } },
    }),
    db.book.count(),
    db.book.count({ where: { createdAt: { lt: todayStart } } }),
    db.borrowing.count({ where: { status: "BORROWED" } }),
    db.borrowing.count({
      where: { status: "BORROWED", borrowedAt: { lt: todayStart } },
    }),
    db.borrowing.count({ where: { status: "PENDING" } }),
    db.student.count({ where: { status: "SUSPENDED" } }),
  ]);

  return {
    totalUsers,
    userGrowth: calculateGrowth(totalUsers, usersYesterdayTotal),
    totalBooks,
    bookGrowth: calculateGrowth(totalBooks, booksYesterdayTotal),
    borrowedBooks: borrowedNow,
    borrowGrowth: calculateGrowth(borrowedNow, borrowedYesterdayTotal),
    pendingBorrowRequests,
    pendingAccountRequests,
  };
}

export async function getRecentBooks() {
  const books = await db.book.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      author: true,
      coverImageUrl: true,
      coverColor: true,
      createdAt: true,
      categories: { select: { category: { select: { name: true } } } },
    },
  });

  return books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    coverImageUrl: b.coverImageUrl,
    coverColor: b.coverColor,
    categories: b.categories.map((c) => c.category.name).join(", "),
    createdAt: b.createdAt.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }),
  }));
}

export async function getRecentBorrowRequests() {
  const requests = await db.borrowing.findMany({
    take: 20,
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      book: {
        select: {
          title: true,
          coverImageUrl: true,
          coverColor: true,
          author: true,
          categories: { select: { category: { select: { name: true } } } },
        },
      },
      student: {
        select: {
          user: { select: { fullName: true, profilePictureUrl: true } },
        },
      },
    },
  });

  return requests.map((r) => ({
    id: r.id,
    bookTitle: r.book.title,
    coverImageUrl: r.book.coverImageUrl,
    coverColor: r.book.coverColor,
    author: r.book.author,
    genre: r.book.categories.map((c) => c.category.name).join(", "),
    studentName: r.student.user.fullName,
    studentAvatar: r.student.user.profilePictureUrl,
    requestedAt: r.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  }));
}

export async function getRecentAccountRequests() {
  const students = await db.student.findMany({
    take: 20,
    where: { status: "SUSPENDED" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      universityName: true,
      user: {
        select: { fullName: true, email: true, profilePictureUrl: true },
      },
    },
  });

  return students.map((s) => ({
    id: s.id,
    fullName: s.user.fullName,
    email: s.user.email,
    avatar: s.user.profilePictureUrl,
    universityName: s.universityName,
    requestedAt: s.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  }));
}
