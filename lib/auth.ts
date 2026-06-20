import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { db } from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      // Allow OAuth sign-in
      if (account?.provider !== "credentials") return true;

      // For credentials, verify user exists in DB
      const existingUser = await db.user.findUnique({
        where: { email: user.email! },
        include: { kyc: true, settings: true },
      });

      if (!existingUser) {
        // No profile found - this triggers redirect to /register
        return "/auth/register";
      }

      // Check if user is suspended/banned
      if (existingUser.status === "SUSPENDED" || existingUser.status === "BANNED") {
        return false;
      }

      // Check 2FA requirement
      if (existingUser.twoFactorEnabled) {
        // Attach 2FA requirement to the session
        (user as { twoFactorRequired?: boolean }).twoFactorRequired = true;
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "USER";
        token.twoFactorRequired = (user as { twoFactorRequired?: boolean }).twoFactorRequired ?? false;
        token.twoFactorVerified = false;
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.image = session.image;
        if (session.role) token.role = session.role;
        if (session.twoFactorVerified) token.twoFactorVerified = true;
      }

      // Fetch latest user data from DB
      if (token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, status: true, twoFactorEnabled: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.status = dbUser.status;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      (session.user as { twoFactorRequired?: boolean; twoFactorVerified?: boolean; status?: string }).twoFactorRequired = token.twoFactorRequired;
      (session.user as { twoFactorRequired?: boolean; twoFactorVerified?: boolean; status?: string }).twoFactorVerified = token.twoFactorVerified;
      (session.user as { twoFactorRequired?: boolean; twoFactorVerified?: boolean; status?: string }).status = token.status;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handles deterministic redirect based on role
      const redirectUrl = url.startsWith("/") ? new URL(url, baseUrl).toString() : url;
      return redirectUrl;
    },
  },
  events: {
    async signIn(message) {
      // Log sign-in event
      if (message.user?.id) {
        await db.auditLog.create({
          data: {
            userId: message.user.id,
            action: "LOGIN",
            resource: "User",
            resourceId: message.user.id,
          },
        }).catch(() => {}); // Non-blocking
      }
    },
    async signOut(message) {
      if (message.session?.userId) {
        await db.auditLog.create({
          data: {
            userId: message.session.userId,
            action: "LOGOUT",
            resource: "User",
            resourceId: message.session.userId,
          },
        }).catch(() => {});
      }
    },
  },
});