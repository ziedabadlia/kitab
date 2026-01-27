import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_ADMIN_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { Role } from "@prisma/client";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  console.log(req.auth);
  const isLoggedIn = !!req.auth;
  console.log(isLoggedIn);

  const role = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return null;

  if (isAuthRoute) {
    if (isLoggedIn) {
      const redirectUrl =
        role === Role.ADMIN
          ? DEFAULT_ADMIN_LOGIN_REDIRECT
          : DEFAULT_LOGIN_REDIRECT;
      return Response.redirect(new URL(redirectUrl, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return null;
});
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
