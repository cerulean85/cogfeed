import { apiError, apiSuccess } from "@/shared/lib/api";
import { getCurrentUser, updateUser } from "@/shared/lib/auth";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  await updateUser(user, {
    subscription: {
      tier: user.subscription?.tier ?? "free",
      status: "canceled",
      currentPeriodEnd: user.subscription?.currentPeriodEnd?.toISOString() ?? null,
      canceledAt: new Date().toISOString(),
    },
  });

  return apiSuccess({ success: true });
}
