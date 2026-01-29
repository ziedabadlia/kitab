import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";
import { UserStatus } from "@prisma/client";

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
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.status = token.status as UserStatus;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.name = existingUser.fullName;
      token.email = existingUser.email;
      token.profilePictureUrl = existingUser.profilePictureUrl;
      token.status = existingUser.status;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
