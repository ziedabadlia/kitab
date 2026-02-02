"use server";

import { signOut } from "@/features/auth/auth";

export const logout = async () => {
  await signOut({
    redirectTo: "/login",
  });
};
