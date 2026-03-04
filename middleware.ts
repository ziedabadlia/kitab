import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_ADMIN_LOGIN_REDIRECT,
} from "@/routes";

// All routes that belong to the student platform
const STUDENT_ROUTE_PREFIXES = ["/", "/books", "/profile", "/about"];

function isStudentRoute(pathname: string) {
  return STUDENT_ROUTE_PREFIXES.some((prefix) =>
    prefix === "/" ? pathname === "/" : pathname.startsWith(prefix),
  );
}

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

  // Logged-in users hitting auth pages get sent to their dashboard
  if (isAuthRoute && isLoggedIn) {
    const redirectTo =
      role === "ADMIN" ? DEFAULT_ADMIN_LOGIN_REDIRECT : DEFAULT_LOGIN_REDIRECT;
    return NextResponse.redirect(new URL(redirectTo, nextUrl));
  }

  // Admin routes: must be logged in as ADMIN
  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (role !== "ADMIN")
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // Student routes: must be logged in as STUDENT
  if (isStudentRoute(nextUrl.pathname)) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (role === "ADMIN")
      return NextResponse.redirect(
        new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl),
      );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
