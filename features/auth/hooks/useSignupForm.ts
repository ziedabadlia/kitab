import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  RegistrationFormInputs,
  registrationSchema,
} from "../validations/zod.schema";

const useSignupForm = () => {
  const form = useForm<RegistrationFormInputs>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      universityID: "",
      password: "",
      universityName: "",
      idCardUpload: undefined,
    },
  });

  const { isSubmitting } = form.formState;

  // 3. Define Submission Handler
  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (
    data: RegistrationFormInputs
  ) => {
    console.log("Submitting validated data:", data);

    // 🚨 File data is in data.idCardUpload[0]
    const fileToUpload = data.idCardUpload[0];
    console.log("File Name:", fileToUpload.name);

    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Registration Successful!");
    form.reset(); // Clear form on success
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
};

export default useSignupForm;
