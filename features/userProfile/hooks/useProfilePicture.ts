"use client";

import { useState, useCallback } from "react";
import { updateProfilePicture } from "../actions/updateProfilePicture";
import { useQueryClient } from "@tanstack/react-query";

export function useProfilePicture(userId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const upload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await updateProfilePicture(userId, file);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
        }
        return result;
      } finally {
        setIsUploading(false);
      }
    },
    [userId, queryClient],
  );

  return { upload, isUploading };
}
