import { z } from "zod";

import { apiError, apiSuccess } from "@/shared/lib/api";
import { getCurrentUser } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

const schema = z.object({
  theme: z.enum(["system", "light", "dark"]).optional(),
  locale: z.enum(["ko", "en"]).optional(),
});

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(400, "INVALID_INPUT", "입력값을 확인해 주세요.");

  const { theme, locale } = parsed.data;
  if (!theme && !locale) return apiError(400, "INVALID_INPUT", "변경할 값이 없습니다.");

  await prisma.user.update({
    where: { id: user.id },
    data: { ...(theme && { theme }), ...(locale && { locale }) },
  });

  return apiSuccess({ ok: true });
}
