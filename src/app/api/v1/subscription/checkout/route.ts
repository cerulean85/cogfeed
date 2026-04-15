import { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/shared/lib/api";
import { getCurrentUser, updateUser } from "@/shared/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  try {
    const body = await req.json();
    if (!body.cardNumber || !body.expiry || !body.cvc || !body.cardHolder) {
      return apiError(400, "INVALID_INPUT", "결제 정보를 모두 입력해 주세요.");
    }

    await updateUser(user, {
      subscription: {
        tier: "premium",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        canceledAt: null,
      },
    });

    return apiSuccess({ success: true, checkoutUrl: null });
  } catch {
    return apiError(500, "INTERNAL_ERROR", "결제 처리 중 오류가 발생했습니다.");
  }
}
