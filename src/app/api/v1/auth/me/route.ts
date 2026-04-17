import { z } from "zod";

import { apiError, apiSuccess } from "@/shared/lib/api";
import { getCurrentUser, hashPassword, sanitizeUser, verifyPassword } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  return apiSuccess(sanitizeUser(user));
}

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  const body = await req.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "INVALID_INPUT", "입력값을 확인해 주세요.");
  }

  const valid = await verifyPassword(parsed.data.currentPassword, user.passwordHash ?? "");
  if (!valid) {
    return apiError(400, "WRONG_PASSWORD", "현재 비밀번호가 올바르지 않습니다.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(parsed.data.newPassword) },
  });

  return apiSuccess({ ok: true });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  const body = await req.json().catch(() => null);
  const parsed = z.object({ password: z.string().min(1) }).safeParse(body);
  if (!parsed.success) {
    return apiError(400, "INVALID_INPUT", "비밀번호를 입력해 주세요.");
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash ?? "");
  if (!valid) {
    return apiError(400, "WRONG_PASSWORD", "비밀번호가 올바르지 않습니다.");
  }

  await prisma.user.delete({ where: { id: user.id } });

  return apiSuccess({ ok: true });
}
