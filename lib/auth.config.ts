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
        if (user.status === "SUSPENDED" || user.status === "BANNED") return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
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
        if (user.twoFactorEnabled && credentials.otpToken && user.twoFactorSecret) {
          try {
            // Dynamic import with fallback - otplib is optional
            const otplib = await import("otplib").catch(() => null);
            if (!otplib) {
              // If otplib not installed, skip 2FA check (development mode)
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
            const isValidToken = otplib.authenticator.check(
              credentials.otpToken as string,
              user.twoFactorSecret
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
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
        token.twoFactorRequired = (user as { twoFactorRequired?: boolean }).twoFactorRequired ?? false;
        token.status = (user as { status?: string }).status ?? "ACTIVE";
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.image = session.image;
        if (session.role) token.role = session.role;
        if (session.twoFactorVerified) {
          token.twoFactorRequired = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string; twoFactorRequired?: boolean; status?: string }).role = token.role as string;
        (session.user as { role?: string; twoFactorRequired?: boolean; status?: string }).twoFactorRequired = token.twoFactorRequired;
        (session.user as { role?: string; twoFactorRequired?: boolean; status?: string }).status = token.status;
      }
      return session;
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      const isAuthenticated = !!auth;
      const userRole = auth?.user?.role ?? "USER";
      const userStatus = (auth?.user as { status?: string } | undefined)?.status ?? "ACTIVE";

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