import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_ADMIN_LOGIN_REDIRECT,
} from "@/routes";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute && isLoggedIn) {
    const redirectTo =
      role === "ADMIN" ? DEFAULT_ADMIN_LOGIN_REDIRECT : DEFAULT_LOGIN_REDIRECT;
    return NextResponse.redirect(new URL(redirectTo, nextUrl));
  }

  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (role !== "ADMIN")
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
