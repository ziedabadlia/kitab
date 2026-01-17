"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { newVerification } from "../actions/newVerification";

export const useVerification = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

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

  return { error, success, loading };
};
