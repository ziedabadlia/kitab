import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookFormValues, bookSchema } from "../validation/bookSchema";
import { useBookMedia } from "./useBookMedia";

interface UseBookFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => Promise<void>;
}

export function useBookForm({ initialData, onSubmit }: UseBookFormProps) {
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
      coverColor: initialData?.coverColor || "#010101",
      categoryIds: getInitialCategoryIds(),
    },
  });

  const media = useBookMedia(form.setValue, initialData?.coverImageUrl);

  const handleFormSubmit = async (data: BookFormValues) => {
    try {
      media.setUploadError(null);
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("description", data.description);
      formData.append("departmentId", data.departmentId);
      formData.append("totalCopies", data.totalCopies.toString());

      if (data.coverColor) formData.append("coverColor", data.coverColor);
      data.categoryIds.forEach((id) => formData.append("categoryIds", id));

      if (data.coverImage instanceof File)
        formData.append("coverImage", data.coverImage);
      if (data.video instanceof File) formData.append("video", data.video);
      if (initialData?.id) formData.append("bookId", initialData.id);

      await onSubmit(formData);
    } catch (error) {
      media.setUploadError(
        error instanceof Error ? error.message : "Failed to submit form",
      );
    }
  };

  return {
    form,
    handleFormSubmit,
    ...media,
  };
}
