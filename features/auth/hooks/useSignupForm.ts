import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  RegistrationFormInputs,
  registrationSchema,
} from "../validations/zod.schema";
import { uploadToCloudinary } from "../actions/uploadToCloudinary";
import { register } from "../actions/register";

const useSignupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (data) => {
    setIsSubmitting(true);

    try {
      // Step 1: Upload the file to Cloudinary first
      const fileToUpload = data.idCardUpload[0];
      const uploadResult = await uploadToCloudinary(fileToUpload);

      if (!uploadResult?.public_id) {
        toast.error("Failed to upload ID card. Please try again.");
        return;
      }

      // Step 2: Pass the Cloudinary public_id to your register action
      const result = await register({
        ...data,
        idCardUpload: uploadResult.public_id, // Ensure this matches your server action
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Registration Successful! Please check your email.");
        form.reset();
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("SIGNUP_ERROR", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
};

export default useSignupForm;
