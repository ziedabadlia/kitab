"use client";

import { useState } from "react";

interface UploadResult {
  url: string;
}

export function useVideoUpload() {
  const [progress, setProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setProgress(null);
    setIsUploading(false);
    setError(null);
  };

  const uploadVideo = async (file: File): Promise<UploadResult> => {
    setError(null);
    setIsUploading(true);
    setProgress(0);

    // Get preset + cloud name from server (keeps env vars server-side)
    const configRes = await fetch("/api/cloudinary-signature");
    if (!configRes.ok) throw new Error("Failed to get upload config");
    const { cloudName, uploadPreset } = await configRes.json();

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "books/videos");

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        setIsUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          setProgress(100);
          console.log("Resolving with URL:", data.secure_url);
          resolve({ url: data.secure_url });
        } else {
          const data = JSON.parse(xhr.responseText);
          const msg =
            data?.error?.message || "Upload failed — please try again.";
          setError(msg);
          reject(new Error(msg));
        }
      });

      xhr.addEventListener("error", () => {
        setIsUploading(false);
        const msg = "Network error during upload.";
        setError(msg);
        reject(new Error(msg));
      });

      xhr.addEventListener("abort", () => {
        setIsUploading(false);
        const msg = "Upload cancelled.";
        setError(msg);
        reject(new Error(msg));
      });

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
      );
      xhr.send(formData);
    });
  };

  return { uploadVideo, progress, isUploading, error, reset };
}
