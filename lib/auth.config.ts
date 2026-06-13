import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days explicitly typed
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    // Empty Credentials fallback wrapper to ensure edge middleware maps runtime schemas correctly
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize() {
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.image = session.image;
        if (session.role) token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      const isAuthenticated = !!auth;
      const userRole = auth?.user?.role;

      // 1. Structural Public Content Gateways
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

      // 2. Structural Admin Route Validation Controls
      if (pathname.startsWith("/admin")) {
        return isAuthenticated && (userRole === "ADMIN" || userRole === "SUPER_ADMIN");
      }

      // 3. Fintech Investor Operational Space Gates
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
        return isAuthenticated;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;