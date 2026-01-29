import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "./data/user";
import { Role, UserStatus } from "@prisma/client";

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
      token.image = existingUser.profilePictureUrl;

      // Resolve status: Admins are ACCEPTED by default.
      // Students use their nested status.
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
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
