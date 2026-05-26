import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  session: {
    strategy: "jwt",
    // 30 days
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
    // We provide an empty Credentials provider wrapper here so NextAuth knows it exists at the Edge level
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
        token.role = (user as { role?: string }).role;
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.image = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      // Public routes
      if (
        pathname === "/" ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/images") ||
        pathname.startsWith("/icons") ||
        pathname === "/favicon.ico" ||
        pathname.startsWith("/about") ||
        pathname.startsWith("/properties") ||
        pathname.startsWith("/education") ||
        pathname.startsWith("/trust") ||
        pathname.startsWith("/auth")
      ) {
        return true;
      }

      // Admin routes
      if (pathname.startsWith("/admin")) {
        return (
          auth?.user?.role === "ADMIN" || auth?.user?.role === "SUPER_ADMIN"
        );
      }

      // Dashboard routes require auth
      if (
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/portfolio") ||
        pathname.startsWith("/invest") ||
        pathname.startsWith("/wallet") ||
        pathname.startsWith("/ai-assistant") ||
        pathname.startsWith("/transactions") ||
        pathname.startsWith("/settings")
      ) {
        return !!auth;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
