import { UsersPage } from "../types/users";

const PAGE_SIZE = 10;

export const usersKeys = {
  all: ["users"] as const,
  list: (p: { page: number; search: string; sort: string; dir: string }) =>
    [...usersKeys.all, p] as const,
};

/**
 * Fetch a paginated list of users with search and sort params
 */
export async function fetchUsers({
  page,
  search,
  sort,
  dir,
}: {
  page: number;
  search: string;
  sort: string;
  dir: string;
}): Promise<UsersPage> {
  const sp = new URLSearchParams({
    page: String(page),
    pageSize: String(PAGE_SIZE),
    search,
    sort,
    dir,
  });

  const res = await fetch(`/api/admin/users?${sp}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch users");
  }

  return res.json();
}

/**
 * Delete a user by ID and Email
 */
export async function deleteUser(userId: string, email: string): Promise<void> {
  const res = await fetch("/api/admin/users", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, email }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete user.");
  }
}
