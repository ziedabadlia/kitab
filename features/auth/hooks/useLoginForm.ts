"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { login } from "../actions/login";
import { LoginFormInputs, loginSchema } from "../validations/zod.schema";

const useLoginForm = () => {
  const router = useRouter();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: LoginFormInputs) => {
    try {
      const result = await login(values);

      if (result?.error) {
        form.reset({ ...values, password: "" });
        toast.error(result.error);
        return;
      }

      if (result?.success) {
        toast.success("Welcome back!");
        form.reset();
        router.refresh();
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
};

export default useLoginForm;
