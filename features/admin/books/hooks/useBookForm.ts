import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookFormValues, bookSchema } from "../validation/bookSchema";
import { useBookMedia } from "./useBookMedia";

interface UseBookFormProps {
  initialData?: any;
  onSubmit: (
    data: FormData,
  ) => Promise<{ success: boolean; message?: string; data?: any }>;
}

export function useBookForm({ initialData, onSubmit }: UseBookFormProps) {
  const router = useRouter();

  const getInitialCategoryIds = () => {
    if (!initialData?.categories || !Array.isArray(initialData.categories)) {
      return [];
    }
    return initialData.categories
      .map((c: any) => c.category?.id || c.categoryId || c.id || null)
      .filter(Boolean);
  };

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: initialData?.title || "",
      author: initialData?.author || "",
      description: initialData?.description || "",
      departmentId:
        initialData?.departmentId || initialData?.department?.id || "",
      totalCopies: initialData?.totalCopies || 1,
      rating: initialData?.rating ?? 0,
      coverColor: initialData?.coverColor || "#010101",
      categoryIds: getInitialCategoryIds(),
    },
  });

  const media = useBookMedia(form.setValue, initialData?.coverImageUrl);

  const handleFormSubmit = async (data: BookFormValues) => {
    media.setUploadError(null);

    if (media.isVideoUploading) {
      media.setUploadError(
        "Please wait for the video to finish uploading before submitting.",
      );
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("description", data.description);
    formData.append("departmentId", data.departmentId);
    formData.append("totalCopies", data.totalCopies.toString());
    formData.append("rating", data.rating.toString());
    if (data.coverColor) formData.append("coverColor", data.coverColor);
    data.categoryIds.forEach((id) => formData.append("categoryIds", id));
    if (data.coverImage instanceof File)
      formData.append("coverImage", data.coverImage);
    // Use ref to get latest URL — avoids stale closure from React state
    const currentVideoUrl = media.videoUrlRef.current;
    if (currentVideoUrl) formData.append("videoUrl", currentVideoUrl);
    if (initialData?.id) formData.append("bookId", initialData.id);

    try {
      const result = await onSubmit(formData);

      if (result.success) {
        toast.success(
          initialData
            ? "Book updated successfully!"
            : "Book created successfully!",
        );
        router.push("/admin/books");
      } else {
        const msg = result.message ?? "Something went wrong.";
        media.setUploadError(msg);
        toast.error(msg);
      }
    } catch (error: any) {
      // Next.js redirect() and notFound() throw special non-Error objects — let them propagate
      if (
        error?.digest?.startsWith("NEXT_REDIRECT") ||
        error?.digest === "NEXT_NOT_FOUND"
      ) {
        throw error;
      }
      const msg =
        error instanceof Error ? error.message : "Failed to submit form";
      media.setUploadError(msg);
      toast.error(msg);
    }
  };

  return {
    form,
    handleFormSubmit,
    ...media,
  };
}
