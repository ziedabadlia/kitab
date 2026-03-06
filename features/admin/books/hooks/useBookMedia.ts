import { useState, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import { BookFormValues } from "../validation/bookSchema";

export function useBookMedia(
  setValue: UseFormSetValue<BookFormValues>,
  initialCover?: string,
) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialCover || null,
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoUrlRef = useRef<string | null>(null);
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  const extractColor = (dataUrl: string) => {
    const img = new Image();
    img.src = dataUrl;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = 40;
      canvas.height = 40;
      ctx.drawImage(img, 0, 0, 40, 40);
      const imgData = ctx.getImageData(0, 0, 40, 40).data;
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
        const hex =
          "#" +
          [Math.round(r / count), Math.round(g / count), Math.round(b / count)]
            .map((n) => n.toString(16).padStart(2, "0"))
            .join("");
        setValue("coverColor", hex, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }
    };
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setUploadError("Invalid image");
    setValue("coverImage", file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
      extractColor(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Called when user selects a file — tracks it locally for display
  const handleVideoChange = (file: File | null) => {
    setVideoFile(file);
    if (!file) {
      setVideoUrl(null);
      videoUrlRef.current = null;
      setIsVideoUploading(false);
    } else {
      setIsVideoUploading(true);
    }
  };

  // Called when direct Cloudinary upload finishes — stores the final URL
  const handleVideoUploadComplete = (url: string) => {
    setVideoUrl(url);
    videoUrlRef.current = url;
    setIsVideoUploading(false);
  };

  return {
    uploadError,
    setUploadError,
    coverPreview,
    videoFile,
    videoUrl,
    handleCoverImageChange,
    handleVideoChange,
    handleVideoUploadComplete,
    isVideoUploading,
    videoUrlRef,
  };
}
