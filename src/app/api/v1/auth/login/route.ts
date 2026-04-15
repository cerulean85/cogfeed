import { NextRequest } from "next/server";

import { signIn } from "@/auth";
import { apiError, apiSuccess } from "@/shared/lib/api";
import { findUserByEmail, sanitizeUser, verifyPassword } from "@/shared/lib/auth";
import { loginSchema } from "@/features/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(400, "INVALID_INPUT", "입력값을 다시 확인해 주세요.");
    }

    const user = await findUserByEmail(parsed.data.email);
    if (!user?.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return apiError(401, "UNAUTHENTICATED", "이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
      redirectTo: "/dashboard",
    });

    return apiSuccess(sanitizeUser(user));
  } catch {
    return apiError(500, "INTERNAL_ERROR", "로그인 처리 중 오류가 발생했습니다.");
  }
}
