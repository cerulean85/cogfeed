import { apiError, apiSuccess } from "@/shared/lib/api";
import { getCurrentUser, sanitizeUser } from "@/shared/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  return apiSuccess(sanitizeUser(user));
}
