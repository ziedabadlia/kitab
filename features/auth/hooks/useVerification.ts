"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "../actions/newVerification";

export const useVerification = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verify = useCallback(async () => {
    if (success || error || loading) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    setLoading(true);
    try {
      const data = await newVerification(token);
      setSuccess(data.success);
      setError(data.error);
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [token, success, error, loading]);

  useEffect(() => {
    verify();
  }, [verify]);

  const description = useMemo(() => {
    if (loading) return "Checking your credentials to secure your account.";
    if (success)
      return "Your email has been successfully verified. You can now access all features.";
    if (error)
      return "The verification link is invalid or has expired. Please try requesting a new one.";
    return "Confirming your verification...";
  }, [loading, success, error]);

  return {
    success,
    error,
    loading,
    description,
    token,
  };
};
