import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware for RealtyX.
 *
 * Uses jose directly instead of NextAuth(authConfig).auth because
 * next-auth v5 bundles Node-only dependencies that cause the Edge
 * compiler to hang indefinitely during module resolution.
 *
 * Validates the next-auth.session-token JWT and enforces route
 * access rules based on the decoded token payload.
 *
 * This is the same token next-auth issues — so session data is
 * seamlessly shared between middleware and the auth library.
 */
const getTokenFromRequest = (request: NextRequest): string | undefined => {
  // next-auth stores the JWT session token in a cookie
  return (
    request.cookies.get("next-auth.session-token")?.value ??
    request.cookies.get("__Secure-next-auth.session-token")?.value
  );
};

const getJwtSecret = (): Uint8Array | null => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
};

interface JwtPayload {
  id?: string;
  role?: string;
  status?: string;
  kycStatus?: string;
  [key: string]: unknown;
}

const verifyToken = async (
  token: string | undefined,
): Promise<JwtPayload | null> => {
  if (!token) return null;

  const secret = getJwtSecret();
  // In dev/edge environments missing secret should never crash middleware.
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;
  } catch {
    return null;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getTokenFromRequest(request);
  const payload = await verifyToken(token);

  const isAuthenticated = !!payload;
  const userRole = payload?.role ?? "USER";
  const userStatus = payload?.status ?? "ACTIVE";

  // 1. Public Content Gateways - always accessible
  if (
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/contact") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname === "/robots.txt" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/properties") ||
    pathname.startsWith("/education") ||
    pathname.startsWith("/trust") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/getting-started") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/compliance") ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next();
  }

  // 2. Admin Route Validation - strict ADMIN/SUPER_ADMIN only
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (userStatus === "SUSPENDED" || userStatus === "BANNED") {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    return NextResponse.next();
  }

  // 3. Protected User Routes - must be authenticated
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/invest") ||
    pathname.startsWith("/wallet") ||
    pathname.startsWith("/ai-assistant") ||
    pathname.startsWith("/transactions") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/earnings") ||
    pathname.startsWith("/capital-calls") ||
    pathname.startsWith("/secondary") ||
    pathname.startsWith("/property-management") ||
    pathname.startsWith("/kyc") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/docs")
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    if (userStatus === "SUSPENDED" || userStatus === "BANNED") {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public assets
     * - service worker
     * - manifest.json
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|assets|public|sw.js|manifest.json).*)",
  ],
};
