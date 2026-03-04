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
  const hasNoCopies = book.availableCopies < 1;
  const categoryName = book.categories?.[0]?.category?.name || "General";

  const { requested, isPending, handleBorrow } = useBorrowRequest(
    book.id,
    hasExistingRequest,
  );

  const buttonDisabled = isSuspended || isPending || requested || hasNoCopies;

  type ButtonState =
    | "suspended"
    | "pending"
    | "requested"
    | "noCopies"
    | "default";

  const buttonState: ButtonState = isSuspended
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
    requested,
    buttonDisabled,
    buttonState,
    handleBorrow,
  };
}
