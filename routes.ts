/**
 * Public routes do not require authentication.
 */
export const publicRoutes = ["/", "/new-verification"];

/**
 * Auth routes redirect logged-in users to the dashboard/home.
 */
export const authRoutes = ["/login", "/register", "/error"];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/";
export const ADMIN_LOGIN_REDIRECT = "/admin";
