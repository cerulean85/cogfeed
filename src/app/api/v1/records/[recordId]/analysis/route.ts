import { NextRequest } from "next/server";

import { apiError, apiSuccess } from "@/shared/lib/api";
import { getCurrentUser } from "@/shared/lib/auth";
import { toApiAnalysis } from "@/shared/lib/analysis";
import { prisma } from "@/shared/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ recordId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  const { recordId } = await params;
  const record = await prisma.record.findUnique({
    where: { id: recordId },
    include: {
      analysis: {
        include: {
          cognitiveErrors: true,
        },
      },
    },
  });

  if (!record) {
    return apiError(404, "NOT_FOUND", "기록을 찾을 수 없습니다.");
  }

  if (record.userId !== user.id) {
    return apiError(403, "FORBIDDEN", "다른 사용자의 기록에는 접근할 수 없습니다.");
  }

  return apiSuccess(toApiAnalysis(record));
}
