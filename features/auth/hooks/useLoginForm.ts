"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Or your preferred toast library
import { useRouter } from "next/navigation";
import { login } from "../actions/login"; // Import the server action we created
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
      // 1. Call the Server Action
      const result = await login(values);

      // 2. Handle Errors returned from Server Action
      if (result?.error) {
        form.reset({ ...values, password: "" }); // Clear password for security
        toast.error(result.error);
        return;
      }

      // 3. Success Feedback
      if (result?.success) {
        toast.success("Welcome back!");
        form.reset();
        // Note: NextAuth usually handles the redirect via 'redirectTo'
        // in the server action, but you can also manually refresh/push here.
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
