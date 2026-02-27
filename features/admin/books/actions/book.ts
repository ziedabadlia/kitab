"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { deleteMedia, uploadImage, uploadVideo } from "../lib/cloudinary";
import { Book } from "../types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getBooksAction({ page = 1, search = "", pageSize = 10 }) {
  const skip = (page - 1) * pageSize;
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { author: { contains: search, mode: "insensitive" as const } },
          {
            department: {
              name: { contains: search, mode: "insensitive" as const },
            },
          },
          {
            categories: {
              some: {
                category: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            },
          },
        ],
      }
    : {};

  const [totalBooks, books] = await Promise.all([
    db.book.count({ where }),
    db.book.findMany({
      where,
      include: {
        department: true,
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
  ]);

  return {
    books: books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.categories.map((c) => c.category.name).join(", "),
      department: book.department.name,
      coverImageUrl: book.coverImageUrl,
      coverColor: book.coverColor,
      createdAt: book.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    })) as Book[],
    totalPages: Math.ceil(totalBooks / pageSize),
  };
}

export async function getBookByIdAction(id: string) {
  try {
    const book = await db.book.findUnique({
      where: { id },
      include: {
        department: true,
        categories: { include: { category: true } },
      },
    });

    if (!book) return { success: false, message: "Book not found" };

    return { success: true, data: book };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// Returns all departments and categories for populating form selects
export async function getBookFormOptions() {
  try {
    const [departments, categories] = await Promise.all([
      db.department.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      db.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);
    return { departments, categories };
  } catch {
    // Return safe defaults so the page doesn't crash if DB is unreachable
    return { departments: [], categories: [] };
  }
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createBookAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const coverImageFile = formData.get("coverImage") as File | null;
    const videoFile = formData.get("video") as File | null;
    const manualCoverColor = formData.get("coverColor") as string | null;

    if (!coverImageFile)
      return { success: false, message: "Cover image is required" };

    const { url: coverImageUrl, color: extractedColor } =
      await uploadImage(coverImageFile);
    const videoUrl =
      videoFile && videoFile.size > 0 ? await uploadVideo(videoFile) : null;

    const slug = `${slugify(title)}-${Math.random().toString(36).substring(2, 8)}`;

    const newBook = await db.book.create({
      data: {
        title,
        author: formData.get("author") as string,
        description: formData.get("description") as string,
        coverImageUrl,
        coverColor: manualCoverColor || extractedColor,
        videoUrl,
        slug,
        totalCopies: parseInt(formData.get("totalCopies") as string) || 1,
        availableCopies: parseInt(formData.get("totalCopies") as string) || 1,
        departmentId: formData.get("departmentId") as string,
        categories: {
          create: (formData.getAll("categoryIds") as string[]).map((id) => ({
            category: { connect: { id } },
          })),
        },
      },
    });

    revalidatePath("/admin/books");
    return { success: true, data: newBook };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateBookAction(formData: FormData) {
  try {
    const bookId = formData.get("bookId") as string;
    if (!bookId) return { success: false, message: "Book ID is required" };

    const existingBook = await db.book.findUnique({
      where: { id: bookId },
      include: { categories: true },
    });
    if (!existingBook) return { success: false, message: "Book not found" };

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const description = formData.get("description") as string;
    const departmentId = formData.get("departmentId") as string;
    const totalCopies = parseInt(formData.get("totalCopies") as string);
    const categoryIds = formData.getAll("categoryIds") as string[];
    const coverImageFile = formData.get("coverImage") as File | null;
    const videoFile = formData.get("video") as File | null;
    const manualCoverColor = formData.get("coverColor") as string | null;

    const updateData: any = { title, author, description, departmentId };

    // Replace cover image if a new one was uploaded
    if (coverImageFile && coverImageFile.size > 0) {
      if (existingBook.coverImageUrl)
        await deleteMedia(existingBook.coverImageUrl, "image");

      const { url: coverImageUrl, color: extractedColor } =
        await uploadImage(coverImageFile);

      updateData.coverImageUrl = coverImageUrl;
      updateData.coverColor =
        manualCoverColor && manualCoverColor.startsWith("#")
          ? manualCoverColor
          : extractedColor;
    }

    // Replace video if a new one was uploaded
    if (videoFile && videoFile.size > 0) {
      if (existingBook.videoUrl)
        await deleteMedia(existingBook.videoUrl, "video");
      updateData.videoUrl = await uploadVideo(videoFile);
    }

    // Adjust available copies proportionally when total copies changes
    if (!isNaN(totalCopies)) {
      const diff = totalCopies - existingBook.totalCopies;
      updateData.totalCopies = totalCopies;
      updateData.availableCopies = Math.max(
        0,
        existingBook.availableCopies + diff,
      );
    }

    await db.book.update({ where: { id: bookId }, data: updateData });

    // Replace categories if provided
    if (categoryIds.length > 0) {
      await db.bookCategory.deleteMany({ where: { bookId } });
      await db.bookCategory.createMany({
        data: categoryIds.map((categoryId) => ({ bookId, categoryId })),
      });
    }

    const finalBook = await db.book.findUnique({
      where: { id: bookId },
      include: {
        department: true,
        categories: { include: { category: true } },
      },
    });

    revalidatePath("/admin/books");
    revalidatePath(`/admin/books/${bookId}`);
    return { success: true, data: finalBook };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteBookAction(bookId: string) {
  const book = await db.book.findUnique({ where: { id: bookId } });
  if (book) {
    if (book.coverImageUrl) await deleteMedia(book.coverImageUrl, "image");
    if (book.videoUrl) await deleteMedia(book.videoUrl, "video");
  }
  await db.book.delete({ where: { id: bookId } });
  revalidatePath("/admin/books");
  return { success: true };
}
