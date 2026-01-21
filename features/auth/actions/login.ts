"use server";

import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/features/auth/auth";
import { loginSchema } from "../validations/zod.schema";
import { getUserByEmail } from "../data/user";
import { DEFAULT_LOGIN_REDIRECT, ADMIN_LOGIN_REDIRECT } from "@/routes";
import { Role } from "@prisma/client";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.hashedPassword) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    return { error: "Please verify your email before logging in." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo:
        existingUser.role === Role.ADMIN
          ? ADMIN_LOGIN_REDIRECT
          : DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Logged in!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};
