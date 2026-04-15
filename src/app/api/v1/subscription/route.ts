import { apiError, apiSuccess } from "@/shared/lib/api";
import { getCurrentUser } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

const FREE_LIMIT = 10;

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.subscription) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [recordsThisMonth, analysisThisMonth] = await Promise.all([
    prisma.record.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: monthStart,
        },
      },
    }),
    prisma.analysis.count({
      where: {
        status: "completed",
        record: {
          userId: user.id,
          createdAt: {
            gte: monthStart,
          },
        },
      },
    }),
  ]);

  return apiSuccess({
    tier: user.subscription.tier,
    status: user.subscription.status,
    currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString() ?? null,
    usage: {
      recordsThisMonth,
      recordsLimit: user.subscription.tier === "free" ? FREE_LIMIT : null,
      analysisThisMonth,
      analysisLimit: user.subscription.tier === "free" ? FREE_LIMIT : null,
    },
  });
}
