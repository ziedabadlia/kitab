import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  departmentId: z.string().min(1, "Department is required"),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
  totalCopies: z.number().min(1, "Must have at least 1 copy"),
  rating: z
    .number({ error: "Rating is required" })
    .min(1, "Rating is required")
    .max(5, "Max rating is 5"),
  coverImage: z.any().or(z.literal("")),
  coverColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color")
    .optional(),
  video: z.any().optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;
