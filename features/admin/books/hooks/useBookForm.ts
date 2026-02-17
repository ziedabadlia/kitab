import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookFormValues, bookSchema } from "../validation/bookSchema";

interface UseBookFormProps {
  initialData?: any;
  onSubmit: (data: FormData) => Promise<void>;
}

export function useBookForm({ initialData, onSubmit }: UseBookFormProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.coverImageUrl || null,
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Helper to extract category IDs
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

  const { setValue } = form;

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setValue("coverImage", file);
    // Reset manual color so optional validation passes if needed
    setValue("coverColor", undefined as any, { shouldDirty: true });

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setCoverPreview(dataUrl);
      extractColor(dataUrl);
    };
    reader.readAsDataURL(file);
    setUploadError(null);
  };

  const extractColor = (dataUrl: string) => {
    try {
      const img = new Image();
      img.src = dataUrl;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = 40;
        const h = Math.max(1, Math.floor((img.height / img.width) * w));
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h).data;

        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let i = 0; i < imgData.length; i += 4) {
          if (imgData[i + 3] === 0) continue;
          r += imgData[i];
          g += imgData[i + 1];
          b += imgData[i + 2];
          count++;
        }

        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          const hex =
            "#" +
            [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");

          setValue("coverColor", hex, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      };
    } catch (err) {
      console.error("Color extraction failed", err);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setUploadError("Please select a valid video file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadError("Video size must be less than 100MB");
      return;
    }

    setValue("video", file);
    setVideoFile(file);
    setUploadError(null);
  };

  const handleFormSubmit = async (data: BookFormValues) => {
    try {
      setUploadError(null);
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
      setUploadError(
        error instanceof Error ? error.message : "Failed to submit form",
      );
    }
  };

  return {
    form,
    uploadError,
    setUploadError,
    coverPreview,
    videoFile,
    handleCoverImageChange,
    handleVideoChange,
    handleFormSubmit,
  };
}
