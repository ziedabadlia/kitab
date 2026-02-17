"use server";

import { db } from "@/lib/db";
import { BookActionResponse } from "../types";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { Book } from "@prisma/client";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 */
async function uploadImageToCloudinary(file: File): Promise<{
  url: string;
  color: string;
}> {
  try {
    // Convert File to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "books/covers",
      resource_type: "image",
      colors: true, // Extract dominant color
      transformation: [
        { width: 800, height: 1200, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    // Get dominant color
    const dominantColor =
      result.colors?.[0]?.[0] || result.predominant?.color || "#010101";

    return {
      url: result.secure_url,
      color: dominantColor,
    };
  } catch (error) {
    console.error("Cloudinary image upload error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}

/**
 * Upload video to Cloudinary
 */
async function uploadVideoToCloudinary(file: File): Promise<string> {
  try {
    // Convert File to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "books/videos",
      resource_type: "video",
      transformation: [{ quality: "auto" }],
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary video upload error:", error);
    throw new Error("Failed to upload video to Cloudinary");
  }
}

/**
 * Delete file from Cloudinary
 */
async function deleteFromCloudinary(
  url: string,
  resourceType: "image" | "video" = "image",
) {
  try {
    // Extract public_id from URL
    const parts = url.split("/");
    const fileWithExtension = parts[parts.length - 1];
    const fileName = fileWithExtension.split(".")[0];
    const folder = parts.slice(-3, -1).join("/"); // Get folder path
    const publicId = `${folder}/${fileName}`;

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    // Don't throw error - file might already be deleted or not exist
  }
}

export async function getBooksAction({
  page = 1,
  search = "",
  pageSize = 10,
}: {
  page?: number;
  search?: string;
  pageSize?: number;
}): Promise<BookActionResponse> {
  try {
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

    const formattedBooks = books.map((book) => ({
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
    }));

    return {
      books: formattedBooks,
      totalPages: Math.ceil(totalBooks / pageSize),
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books");
  }
}

export async function deleteBookAction(bookId: string) {
  try {
    // Get book details to delete associated media
    const book = await db.book.findUnique({
      where: { id: bookId },
    });

    if (book) {
      // Delete cover image from Cloudinary
      if (book.coverImageUrl) {
        await deleteFromCloudinary(book.coverImageUrl, "image");
      }

      // Delete video from Cloudinary
      if (book.videoUrl) {
        await deleteFromCloudinary(book.videoUrl, "video");
      }
    }

    // Delete book from database
    await db.book.delete({
      where: { id: bookId },
    });

    revalidatePath("/admin/books");
    return { success: true };
  } catch (error) {
    console.error("Delete Action Error:", error);
    throw new Error("Could not delete book. It may have active borrows.");
  }
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
    // Extract form data
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const description = formData.get("description") as string;
    const departmentId = formData.get("departmentId") as string;
    const totalCopies = parseInt(formData.get("totalCopies") as string) || 1;
    const categoryIds = formData.getAll("categoryIds") as string[];
    const coverImageFile = formData.get("coverImage") as File | null;
    const videoFile = formData.get("video") as File | null;
    const manualCoverColor = formData.get("coverColor") as string | null; // Manual override

    // Validate required fields
    if (!title || !author || !description || !departmentId) {
      return {
        success: false,
        message:
          "Missing required fields: title, author, description, or department",
      };
    }

    if (!categoryIds || categoryIds.length === 0) {
      return {
        success: false,
        message: "At least one category is required",
      };
    }

    if (!coverImageFile) {
      return {
        success: false,
        message: "Cover image is required",
      };
    }

    // Verify department exists
    const department = await db.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return {
        success: false,
        message: "Selected department does not exist",
      };
    }

    // Verify all categories exist
    const categories = await db.category.findMany({
      where: { id: { in: categoryIds } },
    });

    if (categories.length !== categoryIds.length) {
      return {
        success: false,
        message: "One or more selected categories do not exist",
      };
    }

    // Upload cover image to Cloudinary
    const { url: coverImageUrl, color: extractedColor } =
      await uploadImageToCloudinary(coverImageFile);

    // Use manual color if provided, otherwise use extracted color
    const coverColor = manualCoverColor || extractedColor;

    // Upload video to Cloudinary (if provided)
    let videoUrl: string | null = null;
    if (videoFile && videoFile.size > 0) {
      videoUrl = await uploadVideoToCloudinary(videoFile);
    }

    // Generate unique slug
    const baseSlug = slugify(title);
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}-${randomSuffix}`;

    // Create book with category relationships
    const newBook = await db.book.create({
      data: {
        title,
        author,
        description,
        coverImageUrl,
        coverColor,
        videoUrl,
        slug,
        totalCopies,
        availableCopies: totalCopies,
        departmentId,
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
      include: {
        department: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    revalidatePath("/admin/books");
    return { success: true, data: newBook };
  } catch (error) {
    console.error("Create Book Error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create book record.",
    };
  }
}

export async function updateBookAction(formData: FormData) {
  try {
    const bookId = formData.get("bookId") as string;

    if (!bookId) {
      return { success: false, message: "Book ID is required" };
    }

    // Verify book exists
    const existingBook = await db.book.findUnique({
      where: { id: bookId },
      include: {
        categories: true,
      },
    });

    if (!existingBook) {
      return { success: false, message: "Book not found" };
    }

    // Extract form data
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const description = formData.get("description") as string;
    const departmentId = formData.get("departmentId") as string;
    const totalCopies = parseInt(formData.get("totalCopies") as string);
    const categoryIds = formData.getAll("categoryIds") as string[];
    const coverImageFile = formData.get("coverImage") as File | null;
    const videoFile = formData.get("video") as File | null;
    const manualCoverColor = formData.get("coverColor") as string | null;
    // If updating department, verify it exists
    if (departmentId) {
      const department = await db.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        return {
          success: false,
          message: "Selected department does not exist",
        };
      }
    }

    // Prepare update data
    const updateData: any = {
      title,
      author,
      description,
      departmentId,
    };

    // Handle cover image update
    if (coverImageFile && coverImageFile.size > 0) {
      if (existingBook.coverImageUrl) {
        await deleteFromCloudinary(existingBook.coverImageUrl, "image");
      }

      const { url: coverImageUrl, color: extractedColor } =
        await uploadImageToCloudinary(coverImageFile);

      updateData.coverImageUrl = coverImageUrl;

      // FIX: Only use manualCoverColor if it actually contains a hex value (starts with #)
      // Otherwise, strictly use the extracted color from the new image
      updateData.coverColor =
        manualCoverColor && manualCoverColor.startsWith("#")
          ? manualCoverColor
          : extractedColor;
    }

    // Handle video update
    if (videoFile && videoFile.size > 0) {
      // Delete old video
      if (existingBook.videoUrl) {
        await deleteFromCloudinary(existingBook.videoUrl, "video");
      }

      // Upload new video
      const videoUrl = await uploadVideoToCloudinary(videoFile);
      updateData.videoUrl = videoUrl;
    }

    // Handle total copies update
    if (!isNaN(totalCopies)) {
      const copiesDifference = totalCopies - existingBook.totalCopies;
      updateData.totalCopies = totalCopies;
      // Adjust available copies proportionally
      updateData.availableCopies = Math.max(
        0,
        existingBook.availableCopies + copiesDifference,
      );
    }

    // Update book
    const updatedBook = await db.book.update({
      where: { id: bookId },
      data: updateData,
    });

    // Update categories if provided
    if (categoryIds && categoryIds.length > 0) {
      // Verify all categories exist
      const categories = await db.category.findMany({
        where: { id: { in: categoryIds } },
      });

      if (categories.length !== categoryIds.length) {
        return {
          success: false,
          message: "One or more selected categories do not exist",
        };
      }

      // Delete existing category relationships
      await db.bookCategory.deleteMany({
        where: { bookId },
      });

      // Create new category relationships
      await db.bookCategory.createMany({
        data: categoryIds.map((categoryId) => ({
          bookId,
          categoryId,
        })),
      });
    }

    // Fetch updated book with relations
    const finalBook = await db.book.findUnique({
      where: { id: bookId },
      include: {
        department: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    revalidatePath("/admin/books");
    revalidatePath(`/admin/books/${bookId}`);
    return { success: true, data: finalBook };
  } catch (error) {
    console.error("Update Book Error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update book record.",
    };
  }
}

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
  } catch (error) {
    console.error("Error fetching form options:", error);
    // Return safe defaults so SSR doesn't crash when DB is unreachable
    return { departments: [], categories: [] };
  }
}

export async function getBookByIdAction(id: string) {
  try {
    const book = await db.book.findUnique({
      where: { id },
      include: {
        department: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!book) {
      return { success: false, message: "Book not found" };
    }

    return { success: true, data: book };
  } catch (error) {
    console.error("Error fetching book:", error);
    return { success: false, message: "Failed to fetch book" };
  }
}
