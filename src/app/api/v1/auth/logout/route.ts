import { signOut } from "@/auth";
import { apiError, apiSuccess } from "@/shared/lib/api";
import { getCurrentSession } from "@/shared/lib/auth";

export async function POST() {
  const session = await getCurrentSession();
  if (!session) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  await signOut({
    redirect: false,
    redirectTo: "/login",
  });

  return apiSuccess({ success: true });
}
