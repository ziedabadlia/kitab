"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { deleteMedia, uploadImage, uploadVideo } from "../lib/cloudinary";
import { Book } from "../types";

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

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");

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
    let videoUrl =
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
