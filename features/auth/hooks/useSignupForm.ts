import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  RegistrationFormInputs,
  registrationSchema,
} from "../validations/zod.schema";
import { uploadToCloudinary } from "../actions/uploadToCloudinary";
import { register } from "../actions/register";

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

  const onSubmit: SubmitHandler<RegistrationFormInputs> = async (
    data: RegistrationFormInputs
  ) => {
    console.log("Submitting validated data:", data);

    const fileToUpload = data.idCardUpload[0];
    console.log("File Name:", fileToUpload.name);
    const uploadResult = await uploadToCloudinary(fileToUpload);
    const userResult = await register({
      ...data,
      idCardUrl: uploadResult.public_id,
    });

    if (userResult.error) {
      alert(userResult.error);
    } else {
      alert("Registration Successful!");
    }
    alert("Registration Successful!");
    form.reset();
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
};

export default useSignupForm;
