import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  LoginFormInputs,
  loginSchema,
  RegistrationFormInputs,
  registrationSchema,
} from "../validations/zod.schema";

const useLoginForm = () => {
  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  // 3. Define Submission Handler
  const onSubmit: SubmitHandler<LoginFormInputs> = async (
    data: LoginFormInputs
  ) => {
    console.log("Submitting validated data:", data);
    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Login Successful!");
    form.reset(); // Clear form on success
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
};

export default useLoginForm;
