import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }).trim(),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email address." }),
  universityID: z
    .string()
    .min(1, { message: "University ID is required." })
    .regex(/^\d+$/, { message: "University ID must contain only numbers." })
    .min(8, { message: "ID must be at least 8 digits." })
    .max(12, { message: "ID cannot exceed 12 digits." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password needs at least one uppercase letter.",
    })
    .regex(/[0-9]/, { message: "Password needs at least one number." }),

  idCardUpload: z.union([
    z.string().min(1, "ID Card is required"),
    z
      .any()
      .refine(
        (val) => val && val.length > 0,
        "University ID Card file is required.",
      )
      .refine((val) => {
        if (typeof val === "string") return true;
        return val?.[0]?.size <= 5000000;
      }, "Max file size is 5MB.")
      .refine((val) => {
        if (typeof val === "string") return true;
        return ["image/jpeg", "image/png", "application/pdf"].includes(
          val?.[0]?.type,
        );
      }, "Only JPG, PNG, and PDF files are accepted."),
  ]),

  universityName: z
    .string()
    .min(1, { message: "Please select your university." }),
});

export const loginSchema = z.object({
  email: z
    .string()

    .email({ message: "Invalid email address." }),
  password: z.string(),
});

export type RegistrationFormInputs = z.infer<typeof registrationSchema>;
export type LoginFormInputs = z.infer<typeof loginSchema>;
