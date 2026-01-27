"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { registrationSchema } from "../validations/zod.schema";
import { sendVerificationEmail } from "../lib/mail";
import { generateVerificationToken } from "../lib/token";

export const register = async (values: any) => {
  const validatedFields = registrationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const {
    email,
    password,
    fullName,
    universityName,
    universityID,
    idCardUpload,
  } = validatedFields.data;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) return { error: "User with this email already exists!" };

  const existingStudent = await db.student.findUnique({
    where: { studentIdNumber: universityID },
  });
  if (existingStudent)
    return { error: "This Student ID is already registered!" };

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          fullName,
          hashedPassword,
        },
      });

      await tx.student.create({
        data: {
          userId: user.id,
          studentIdNumber: universityID,
          universityName,
          universityIdCardUrl: idCardUpload,
        },
      });
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Registration successful! Please verify your email." };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong. Please try again later." };
  }
};
