import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "./db";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
    ...authConfig.providers.filter((p) => p.id !== "credentials"),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.password,
        );

        if (!isValid) return null;

        // Determine the role, forcing admin status for your testing email
        const userRole =
          parsed.data.email === "edisonelvisy@gmail.com"
            ? "ADMIN"
            : ((user as { role?: string }).role ?? "USER");

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: userRole,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // 1. Pass the role from the authorize object into the secure JWT web token
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      // 2. Extract the role from the JWT token and pass it to the frontend session client
      if (session.user && token) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
