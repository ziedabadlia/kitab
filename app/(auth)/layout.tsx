import AuthBackgroundImage from "@/features/auth/components/AuthBackgroundImage";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthBackgroundImage>{children}</AuthBackgroundImage>;
};

export default AuthLayout;
