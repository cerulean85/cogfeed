import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { authConfig } from "@/auth.config";
import { loginSchema } from "@/features/auth";
import { prisma } from "@/shared/lib/prisma";
import { sanitizeUser, verifyPassword } from "@/shared/lib/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(parsed.data.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        const safeUser = sanitizeUser(user);
        return {
          id: user.id,
          email: user.email,
          onboardingCompleted: safeUser.onboardingCompleted,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
        token.onboardingCompleted = user.onboardingCompleted ?? false;
      }

      return token;
    },
    async session({ session, token }) {
      const userId = typeof token.sub === "string" ? token.sub : null;
      const dbUser = userId
        ? await prisma.user.findUnique({ where: { id: userId } })
        : null;

      if (session.user && userId) {
        session.user.id = userId;
        session.user.email = session.user.email ?? token.email ?? "";
        session.user.onboardingCompleted =
          dbUser?.onboardingCompleted ??
          (typeof token.onboardingCompleted === "boolean" ? token.onboardingCompleted : false);
      }

      return session;
    },
  },
});
