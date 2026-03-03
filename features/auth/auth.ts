import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { Role, UserStatus } from "@prisma/client";
import authConfig from "@/auth.config";
import { getUserByEmail, getUserById } from "./data/user";
import { loginSchema } from "./validations/zod.schema";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.name = existingUser.fullName;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.profilePictureUrl = existingUser.profilePictureUrl;
      token.status =
        existingUser.role === "ADMIN"
          ? "ACCEPTED"
          : existingUser.student?.status || "SUSPENDED";

      return token;
    },
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
        session.user.status = token.status as UserStatus;
        session.user.profilePictureUrl = token.profilePictureUrl as string;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;
        const user = await getUserByEmail(email);
        if (!user || !user.hashedPassword) return null;

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword,
        );
        if (!passwordsMatch) return null;

        return user;
      },
    }),
  ],
});
