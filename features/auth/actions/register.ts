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

  try {
    const user = await db.user.create({
      data: {
        email,
        fullName,
        hashedPassword,
      },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return { error: "Something went wrong during registration." };
  }
};
