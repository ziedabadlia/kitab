import { UserRole } from "@/lib/generated/prisma/enums";
import { UserStatus } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// If you have a Status enum in Prisma, import it here:
// import { Status } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      status: UserStatus;
      name: string;
      email: string;
      image: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    status: UserStatus;
    name: string;
    email: string;
    image: string | null;
  }
}
