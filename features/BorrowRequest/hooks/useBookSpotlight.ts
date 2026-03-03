"use client";

import { Prisma, Role, UserStatus } from "@prisma/client";
import { useBorrowRequest } from "./useBorrowRequest";

type BookWithCategories = Prisma.BookGetPayload<{
  include: {
    categories: { include: { category: true } };
  };
}>;

interface UseBookSpotlightParams {
  book: BookWithCategories;
  status: UserStatus;
  role: Role;
  hasExistingRequest?: boolean;
}

export function useBookSpotlight({
  book,
  status,
  role,
  hasExistingRequest = false,
}: UseBookSpotlightParams) {
  const isSuspended = role === "STUDENT" && status !== "ACCEPTED";
  const categoryName = book.categories?.[0]?.category?.name || "General";

  const { requested, isPending, handleBorrow } = useBorrowRequest(
    book.id,
    hasExistingRequest,
  );

  const buttonDisabled = isSuspended || isPending || requested;

  type ButtonState = "suspended" | "pending" | "requested" | "default";

  const buttonState: ButtonState = isSuspended
    ? "suspended"
    : isPending
      ? "pending"
      : requested
        ? "requested"
        : "default";

  return {
    categoryName,
    isSuspended,
    isPending,
    requested,
    buttonDisabled,
    buttonState,
    handleBorrow,
  };
}
