import NextAuth from "next-auth";
import type { Session, DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().email("Invalid corporate or personal email configuration"),
  password: z
    .string()
    .min(6, "Security parameters demand minimum 6 characters"),
});

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers.filter((provider) => provider.id !== "credentials"),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email Address", type: "email" },
        password: { label: "Secure Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase().trim() },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          parsed.data.password,
          user.password,
        );

        if (!isPasswordValid) return null;

        // Prevent suspended or banned actors from generating valid active runtime scopes
        if (user.status === "SUSPENDED" || user.status === "BANNED") {
          throw new Error("ACCOUNT_RESTRICTED");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role, // Inherited cleanly from localization schema (USER, INVESTOR, ADMIN, SUPER_ADMIN)
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      // Execute foundational mappings via the shared configuration first
      const baseToken = await authConfig.callbacks.jwt({
        token,
        user,
        trigger,
        session,
      });

      if (user) {
        baseToken.role = (user as { role?: string }).role;
      }
      return baseToken;
    },
    async session({ session, token }) {
      // Synthesize default mapping frames across the pipeline
      // Call the shared session callback first (may not include `expires`)
      const baseSession = (await authConfig.callbacks.session({
        session,
        token,
        user: { id: token.id as string },
      } as Parameters<typeof authConfig.callbacks.session>[0])) as
        | Session
        | DefaultSession
        | null
        | undefined;

      // Ensure the returned object conforms to DefaultSession / Session by preserving or injecting `expires`
      const result = {
        ...(baseSession || {}),
        // Prefer the explicit expires from the incoming session, fallback to baseSession.expires if present
        expires:
          (session as Session | DefaultSession)?.expires ??
          (baseSession as Session | DefaultSession)?.expires,
      } as Session | DefaultSession;

      if (result.user && token) {
        (result.user as DefaultSession["user"] & { role?: string }).role =
          token.role as string;
      }

      return result;
    },
  },
});
