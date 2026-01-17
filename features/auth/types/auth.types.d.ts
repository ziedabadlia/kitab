import { Role } from "@/features/auth/auth";
import { UserRole } from "@/lib/generated/prisma/enums";
import { DefaultSession, User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      // isTwoFactorEnabled: boolean;
      name: string;
      email: string;
      // isOAuth: boolean;
    } & DefaultSession["user"];
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    // isOAuth: boolean;
    role: UserRole;
    // isTwoFactorEnabled: boolean;
    name: string;
    email: string;
  }
}
