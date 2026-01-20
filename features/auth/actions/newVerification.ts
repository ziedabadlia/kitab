"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "../data/user";
import { getVerificationTokenByToken } from "../data/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const exisitingUser = await getUserByEmail(existingToken.email);

  if (!exisitingUser) {
    return { error: "Email does not exist!" };
  }

  try {
    await db.$transaction([
      db.user.update({
        where: {
          id: exisitingUser.id,
        },
        data: {
          emailVerified: new Date(),
          email: existingToken.email,
        },
      }),
      db.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      }),
    ]);
    return { success: "Email verified successfully!" };
  } catch (error) {
    console.error("Verification transaction failed: ", error);
    return { error: "Something went wrong. Please try again." };
  }
};
