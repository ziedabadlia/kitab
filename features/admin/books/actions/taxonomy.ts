"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createDepartment(
  name: string,
): Promise<{ id: string; name: string } | { error: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Department name is required." };

  const slug = toSlug(trimmed);

  const existing = await db.department.findFirst({
    where: {
      OR: [{ name: { equals: trimmed, mode: "insensitive" } }, { slug }],
    },
  });
  if (existing) return { id: existing.id, name: existing.name };

  const department = await db.department.create({
    data: { name: trimmed, slug },
  });

  revalidatePath("/admin/books");
  revalidatePath("/admin/books/new");
  return { id: department.id, name: department.name };
}

export async function createCategory(
  name: string,
): Promise<{ id: string; name: string } | { error: string }> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Category name is required." };

  const slug = toSlug(trimmed);

  const existing = await db.category.findFirst({
    where: {
      OR: [{ name: { equals: trimmed, mode: "insensitive" } }, { slug }],
    },
  });
  if (existing) return { id: existing.id, name: existing.name };

  const category = await db.category.create({
    data: { name: trimmed, slug },
  });

  revalidatePath("/admin/books");
  revalidatePath("/admin/books/new");
  return { id: category.id, name: category.name };
}
