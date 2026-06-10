import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Simple session check using NextAuth session token
  const hasSession =
    request.cookies.has("next-auth.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token");

  // Protect dashboard routes for unauthenticated users
  if (pathname.startsWith("/dashboard") && !hasSession) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && !hasSession) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

// Exclusion block for safe package rendering
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)"],
};
