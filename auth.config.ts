import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  secret: process.env.AUTH_SECRET,
  providers: [Credentials({})],
} satisfies NextAuthConfig;
