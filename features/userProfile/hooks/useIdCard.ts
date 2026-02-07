"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IdCardFormData } from "../types";
import { generateIdCard } from "../actions/generateIdCard";

export function useIdCard(studentId: string) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const generate = useCallback(
    async (data: IdCardFormData) => {
      setIsGenerating(true);
      try {
        const result = await generateIdCard(studentId, data);
        if (result.success) {
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          setShowModal(false);
        }
        return result;
      } finally {
        setIsGenerating(false);
      }
    },
    [studentId, queryClient],
  );

  return {
    generate,
    isGenerating,
    showModal,
    setShowModal,
  };
}
