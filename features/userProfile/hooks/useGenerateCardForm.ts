import { useState, useEffect, useMemo } from "react";
import { StudentProfile } from "../types";
import { useIdCard } from "./useIdCard";

export function useGenerateCardForm(
  profile: StudentProfile,
  onClose: () => void,
) {
  const { generate, isGenerating } = useIdCard(profile.id);

  // Memoize initial values for stable comparison
  const initialValues = useMemo(
    () => ({
      dateOfBirth: profile.dateOfBirth
        ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
        : "",
      department: profile.department || "",
      contactNo: profile.contactNo || "",
      address: profile.address || "",
    }),
    [profile],
  );

  const [formData, setFormData] = useState(initialValues);

  // Sync state if profile data changes from the server
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const isUnchanged = useMemo(
    () =>
      formData.dateOfBirth === initialValues.dateOfBirth &&
      formData.department === initialValues.department &&
      formData.contactNo === initialValues.contactNo &&
      formData.address === initialValues.address,
    [formData, initialValues],
  );

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnchanged || isGenerating) return;

    await generate(formData);
    onClose();
  };

  return {
    formData,
    isGenerating,
    isUnchanged,
    handleInputChange,
    handleSubmit,
  };
}
