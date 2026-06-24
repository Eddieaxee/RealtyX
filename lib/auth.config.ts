import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Microsoft from "next-auth/providers/microsoft-entra-id";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/register",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Microsoft({
      clientId: process.env.MICROSOFT_CLIENT_ID ?? "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? "",
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID ?? "",
      clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
    }),
    // Empty Credentials fallback wrapper to ensure edge middleware maps runtime schemas correctly
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otpToken: { label: "2FA Code", type: "text", optional: true },
      },
      async authorize(credentials) {
        // This is a stub for edge middleware - actual auth happens in route handlers
        if (!credentials?.email) return null;

        // Import db dynamically to avoid edge runtime issues
        const { db } = await import("@/lib/db");
        const bcrypt = await import("bcryptjs");

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: { settings: true },
        });

        if (!user?.password) return null;
        if (user.status === "SUSPENDED" || user.status === "BANNED")
          return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        if (!isValid) return null;

        // If 2FA is enabled and no OTP token provided, still authorize but flag for 2FA
        if (user.twoFactorEnabled && !credentials.otpToken) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            twoFactorRequired: true,
          };
        }

        // If 2FA is enabled and OTP token provided, verify it
        if (
          user.twoFactorEnabled &&
          credentials.otpToken &&
          user.twoFactorSecret
        ) {
          try {
            // Dynamic import with fallback - otplib is optional
            const otplibModule = await import("otplib").catch(() => null);
            if (!otplibModule) {
              // If otplib not installed, skip 2FA check (development mode)
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
            // otplib exports an 'authenticator' named export
            const { authenticator } = otplibModule as unknown as {
              authenticator: {
                check: (token: string, secret: string) => boolean;
              };
            };
            const isValidToken = authenticator.check(
              credentials.otpToken as string,
              user.twoFactorSecret,
            );
            if (!isValidToken) return null;
          } catch {
            return null;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const authenticatedUser = user as {
          id: string;
          role?: string;
          twoFactorRequired?: boolean;
          status?: string;
          kycStatus?: string;
        };

        token.id = authenticatedUser.id;
        token.role = authenticatedUser.role ?? "USER";
        token.twoFactorRequired = authenticatedUser.twoFactorRequired ?? false;
        token.status = authenticatedUser.status ?? "ACTIVE";
        token.kycStatus = authenticatedUser.kycStatus ?? "NONE";
      }
      if (trigger === "update" && session) {
        const s = session as Record<string, unknown>;
        if (typeof s.name === "string") token.name = s.name;
        if (typeof s.image === "string") token.image = s.image;
        if (typeof s.role === "string") token.role = s.role;
        if (typeof s.kycStatus === "string") token.kycStatus = s.kycStatus;
        if (s.twoFactorVerified === true) {
          token.twoFactorRequired = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (
          session.user as {
            role?: string;
            twoFactorRequired?: boolean;
            status?: string;
            kycStatus?: string;
          }
        ).role = token.role as string;
        (
          session.user as {
            role?: string;
            twoFactorRequired?: boolean;
            status?: string;
            kycStatus?: string;
          }
        ).twoFactorRequired = token.twoFactorRequired as boolean;
        (
          session.user as {
            role?: string;
            twoFactorRequired?: boolean;
            status?: string;
            kycStatus?: string;
          }
        ).status = token.status as string;
        (
          session.user as {
            role?: string;
            twoFactorRequired?: boolean;
            status?: string;
            kycStatus?: string;
          }
        ).kycStatus = token.kycStatus as string;
      }
      return session;
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      const isAuthenticated = !!auth;
      const userRole = auth?.user?.role ?? "USER";
      const userStatus =
        (auth?.user as { status?: string } | undefined)?.status ?? "ACTIVE";

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
        return true;
      }

      // 2. Registration page - accessible to unauthenticated
      if (pathname === "/auth/register") {
        return true;
      }

      // 3. Admin Route Validation - strict ADMIN/SUPER_ADMIN only
      if (pathname.startsWith("/admin")) {
        if (!isAuthenticated) return false;
        if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") return false;
        // Check if user is not suspended
        if (userStatus === "SUSPENDED" || userStatus === "BANNED") return false;
        return true;
      }

      // 4. Protected User Routes - must be authenticated
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
        if (!isAuthenticated) return false;
        if (userStatus === "SUSPENDED" || userStatus === "BANNED") return false;
        return true;
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Handles deterministic redirect after login
      const parsedUrl = new URL(url, baseUrl);

      // Allow relative redirects
      if (url.startsWith("/")) {
        return new URL(url, baseUrl).toString();
      }

      // Same-origin redirects
      if (parsedUrl.origin === baseUrl) {
        return url;
      }

      // Default to base URL
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;
