"use server";

import { db } from "@/lib/db";
// import { RegisterSchema } from "@/schemas";
import bcrypt from "bcrypt";
import z from "zod";
import { registrationSchema } from "../validations/zod.schema";
import { sendVerificationEmail } from "../lib/mail";
import { generateVerificationToken } from "../lib/token";

export const register = async (
  values: z.infer<typeof registrationSchema>
): Promise<{ error?: string; success?: string }> => {
  const validatedFields = registrationSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { email, password, fullName } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      error: "User already exists",
    };
  }

  db.user
    .create({
      data: {
        email,
        fullName,
        hashedPassword,
      },
    })
    .then((user) => {
      console.log(user);
    })
    .catch((err) => {
      console.log(err);
    });

  const verificationToken = await generateVerificationToken(email);
  sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: "confirmation email sent!",
  };
};
