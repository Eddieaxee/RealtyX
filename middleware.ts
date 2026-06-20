import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";

/**
 * Auth.js v5 official middleware pattern.
 * Uses the `authorized` callback from authConfig to handle route protection.
 * Strips unauthorized requests to /admin/* and protected routes.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public assets
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|assets|public).*)",
  ],
};