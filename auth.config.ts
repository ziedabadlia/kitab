import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { loginSchema } from "./features/auth/validations/zod.schema";
import { getUserByEmail } from "./features/auth/data/user";

export default {
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.hashedPassword) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.hashedPassword,
          );

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
