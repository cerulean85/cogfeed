import { NextRequest } from "next/server";

import { analyzeRecord } from "@/entities/analysis";
import { apiError, apiSuccess } from "@/shared/lib/api";
import { createMockAnalysis } from "@/shared/lib/analysis";
import { getCurrentUser } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

function mapErrorType(type: string) {
  switch (type) {
    case "확증 편향":
      return "confirmation_bias";
    case "가용성 편향":
      return "availability_heuristic";
    case "앵커링 오류":
      return "anchoring";
    case "흑백 논리":
      return "black_and_white_thinking";
    case "과일반화":
    case "과잉 일반화":
      return "overgeneralization";
    case "파국화":
      return "catastrophizing";
    default:
      return "confirmation_bias";
  }
}

export async function POST(
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
    include: { analysis: true },
  });

  if (!record || !record.analysis) {
    return apiError(404, "NOT_FOUND", "기록을 찾을 수 없습니다.");
  }

  if (record.userId !== user.id) {
    return apiError(403, "FORBIDDEN", "다른 사용자의 기록에는 접근할 수 없습니다.");
  }

  await prisma.analysis.update({
    where: { recordId },
    data: {
      status: "pending",
      retryCount: {
        increment: 1,
      },
    },
  });

  try {
    const analysis =
      process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY
        ? await analyzeRecord(record.content)
        : createMockAnalysis(record.content);

    await prisma.analysis.update({
      where: { recordId },
      data: {
        status: "completed",
        overallFeedback: analysis.overall_feedback,
        analyzedAt: new Date(),
        cognitiveErrors: {
          deleteMany: {},
          create: analysis.errors.map((error) => ({
            type: mapErrorType(error.type),
            excerpt: error.excerpt,
            feedback: error.suggestion,
          })),
        },
      },
    });

    return apiSuccess({
      recordId,
      analysisStatus: "completed",
    });
  } catch {
    await prisma.analysis.update({
      where: { recordId },
      data: {
        status: "failed",
      },
    });

    return apiError(503, "AI_SERVICE_UNAVAILABLE", "분석 서비스를 현재 사용할 수 없습니다.");
  }
}
