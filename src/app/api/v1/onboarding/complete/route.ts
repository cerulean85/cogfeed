import { apiError, apiSuccess } from "@/shared/lib/api";
import { getCurrentUser, sanitizeUser, updateUser } from "@/shared/lib/auth";

export async function PATCH() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  const updated = await updateUser(user, { onboardingCompleted: true });
  return apiSuccess(sanitizeUser(updated));
}
