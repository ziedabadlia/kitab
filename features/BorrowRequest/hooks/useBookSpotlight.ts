"use client";

import { Prisma, Role, UserStatus } from "@prisma/client";
import { useBorrowRequest } from "./useBorrowRequest";

type BookWithCategories = Prisma.BookGetPayload<{
  include: { categories: { include: { category: true } } };
}>;

interface UseBookSpotlightParams {
  book: BookWithCategories;
  status: UserStatus;
  role: Role;
}

export function useBookSpotlight({
  book,
  status,
  role,
}: UseBookSpotlightParams) {
  const isSuspended = role === "STUDENT" && status !== "ACCEPTED";
  const hasNoCopies = book.availableCopies < 1;
  const categoryName = book.categories?.[0]?.category?.name || "General";

  const { requested, isPending, isCheckingStatus, handleBorrow } =
    useBorrowRequest(book.id);

  const buttonDisabled =
    isSuspended || isPending || requested || hasNoCopies || isCheckingStatus;

  type ButtonState =
    | "suspended"
    | "pending"
    | "requested"
    | "noCopies"
    | "checking"
    | "default";

  const buttonState: ButtonState = isCheckingStatus
    ? "checking"
    : isSuspended
      ? "suspended"
      : hasNoCopies
        ? "noCopies"
        : isPending
          ? "pending"
          : requested
            ? "requested"
            : "default";

  return {
    categoryName,
    isSuspended,
    hasNoCopies,
    isPending,
    isCheckingStatus,
    requested,
    buttonDisabled,
    buttonState,
    handleBorrow,
  };
}
