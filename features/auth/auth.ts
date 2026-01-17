import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "../../lib/db";
import { getUserByEmail, getUserById } from "./data/user";
import { getAccountByUserId } from "./data/account";
import { loginSchema } from "./validations/zod.schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }
      const existingUser = await getUserById(user.id!);
      if (!existingUser?.emailVerified) {
        return false;
      }
      // if (existingUser.isTwoFactorEnabled) {
      //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
      //     existingUser.id
      //   );
      //   if (!twoFactorConfirmation) {
      //     return false;
      //   }
      //   await db.twoFactorConfirmation.delete({
      //     where: {
      //       id: twoFactorConfirmation.id,
      //     },
      //   });
      // }

      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.role) {
          session.user.role = token.role;
        }
        // if (token.isTwoFactorEnabled) {
        //   session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        // }
        session.user.name = token.name;
        session.user.email = token.email;
        // session.user.isOAuth = token.isOAuth;
      }
      return session;
    },
    async jwt({ token }) {
      if (token.sub) {
        const existingUser = await getUserById(token.sub);
        const existingAccount =
          existingUser && (await getAccountByUserId(existingUser.id));
        if (existingUser) {
          // token.isOAuth = !!existingAccount;
          token.fullName = existingUser.fullName!;
          token.email = existingUser.email;
          token.role = existingUser.role;
          // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
        }
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        if (!user || !user.hashedPassword) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (!passwordMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
});
