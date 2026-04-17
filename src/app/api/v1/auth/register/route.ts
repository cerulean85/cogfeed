import { NextRequest } from "next/server";
import { z } from "zod";

import { apiError, apiSuccess } from "@/shared/lib/api";
import { createUser, findUserByEmail, sanitizeUser } from "@/shared/lib/auth";
import { registerSchema } from "@/features/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.extend({
      agreedToTerms: z.literal(true),
      marketingConsent: z.boolean().optional(),
    }).safeParse(body);

    if (!parsed.success || body.agreedToTerms !== true) {
      return apiError(400, "INVALID_INPUT", "입력값을 다시 확인해 주세요.");
    }

    const email = parsed.data.email.toLowerCase();
    if (await findUserByEmail(email)) {
      return apiError(409, "EMAIL_ALREADY_EXISTS", "이미 사용 중인 이메일입니다.");
    }

    const user = await createUser(email, parsed.data.password, parsed.data.marketingConsent ?? false);
    return apiSuccess(sanitizeUser(user), { status: 201 });
  } catch {
    return apiError(500, "INTERNAL_ERROR", "회원가입 처리 중 오류가 발생했습니다.");
  }
}
