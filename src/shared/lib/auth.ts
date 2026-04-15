import { createHash } from "node:crypto";

import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import type { Session, User } from "@/entities/user";
import { AUTH_COOKIE_NAME } from "@/shared/config/auth";
import { prisma } from "@/shared/lib/prisma";

function hashPasswordLegacy(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  if (passwordHash.startsWith("$2")) {
    return bcrypt.compare(password, passwordHash);
  }

  return hashPasswordLegacy(password) === passwordHash;
}

export function sanitizeUser(user: {
  id: string;
  email: string;
  onboardingCompleted: boolean;
  subscription: {
    tier: "free" | "premium";
    status: "active" | "expired" | "canceled";
  } | null;
}): {
  userId: string;
  email: string;
  onboardingCompleted: boolean;
  subscriptionStatus: "free" | "premium" | "expired";
} {
  return {
    userId: user.id,
    email: user.email,
    onboardingCompleted: user.onboardingCompleted,
    subscriptionStatus:
      user.subscription?.status === "expired" ? "expired" : user.subscription?.tier ?? "free",
  };
}

export async function createUser(email: string, password: string) {
  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      subscription: {
        create: {
          tier: "free",
          status: "active",
        },
      },
    },
    include: {
      subscription: true,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { subscription: true },
  });
}

export async function getCurrentSession() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return {
    token: AUTH_COOKIE_NAME,
    userId: session.user.id,
    createdAt: new Date().toISOString(),
  } satisfies Session;
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });
}

export async function updateUser(
  user: Pick<User, "id">,
  patch: {
    onboardingCompleted?: boolean;
    subscription?: {
      tier?: "free" | "premium";
      status?: "active" | "expired" | "canceled";
      currentPeriodEnd?: string | null;
      canceledAt?: string | null;
    };
  }
) {
  return prisma.user.update({
    where: { id: user.id },
    data: {
      onboardingCompleted: patch.onboardingCompleted,
      subscription: patch.subscription
        ? {
            upsert: {
              create: {
                tier: patch.subscription.tier ?? "free",
                status: patch.subscription.status ?? "active",
                currentPeriodEnd: patch.subscription.currentPeriodEnd
                  ? new Date(patch.subscription.currentPeriodEnd)
                  : null,
                canceledAt: patch.subscription.canceledAt
                  ? new Date(patch.subscription.canceledAt)
                  : null,
              },
              update: {
                tier: patch.subscription.tier,
                status: patch.subscription.status,
                currentPeriodEnd:
                  patch.subscription.currentPeriodEnd === undefined
                    ? undefined
                    : patch.subscription.currentPeriodEnd
                    ? new Date(patch.subscription.currentPeriodEnd)
                    : null,
                canceledAt:
                  patch.subscription.canceledAt === undefined
                    ? undefined
                    : patch.subscription.canceledAt
                    ? new Date(patch.subscription.canceledAt)
                    : null,
              },
            },
          }
        : undefined,
    },
    include: {
      subscription: true,
    },
  });
}
