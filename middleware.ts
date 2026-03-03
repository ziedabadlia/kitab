import { auth } from "@/features/auth/auth";
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_ADMIN_LOGIN_REDIRECT,
} from "@/routes";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute && isLoggedIn) {
    const redirectTo =
      role === "ADMIN" ? DEFAULT_ADMIN_LOGIN_REDIRECT : DEFAULT_LOGIN_REDIRECT;
    return Response.redirect(new URL(redirectTo, nextUrl));
  }

  if (isAdminRoute) {
    if (!isLoggedIn) return Response.redirect(new URL("/login", nextUrl));
    if (role !== "ADMIN")
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
