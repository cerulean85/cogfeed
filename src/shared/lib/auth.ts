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
}): {
  userId: string;
  email: string;
  onboardingCompleted: boolean;
} {
  return {
    userId: user.id,
    email: user.email,
    onboardingCompleted: user.onboardingCompleted,
  };
}

export async function createUser(email: string, password: string, marketingConsent = false) {
  return prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      marketingConsent,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
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
  });
}

export async function updateUser(
  user: Pick<User, "id">,
  patch: { onboardingCompleted?: boolean }
) {
  return prisma.user.update({
    where: { id: user.id },
    data: {
      onboardingCompleted: patch.onboardingCompleted,
    },
  });
}
