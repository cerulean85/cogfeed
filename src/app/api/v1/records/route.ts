import { randomUUID } from "node:crypto";

import { NextRequest } from "next/server";

import { analyzeRecord } from "@/entities/analysis";
import { apiError, apiSuccess, parsePagination } from "@/shared/lib/api";
import { createMockAnalysis } from "@/shared/lib/analysis";
import { getCurrentUser } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

const FREE_LIMIT = 10;
type RecordAnalysisStatus = "pending" | "completed" | "failed" | "skipped";

type RecordWithAnalysis = {
  id: string;
  content: string;
  createdAt: Date;
  analysis: {
    status: RecordAnalysisStatus;
    analyzedAt: Date | null;
  } | null;
};

async function countMonthlyRecords(userId: string) {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  return prisma.record.count({
    where: {
      userId,
      createdAt: {
        gte: monthStart,
      },
    },
  });
}

async function countMonthlyAnalyses(userId: string) {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  return prisma.analysis.count({
    where: {
      status: "completed",
      record: {
        userId,
        createdAt: {
          gte: monthStart,
        },
      },
    },
  });
}

async function runAnalysis(recordId: string) {
  const record = await prisma.record.findUnique({
    where: { id: recordId },
  });

  if (!record) {
    return;
  }

  try {
    const result =
      process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY
        ? await analyzeRecord(record.content)
        : createMockAnalysis(record.content);

    await prisma.analysis.update({
      where: { recordId },
      data: {
        status: "completed",
        overallFeedback: result.overall_feedback,
        analyzedAt: new Date(),
        cognitiveErrors: {
          deleteMany: {},
          create: result.errors.map((error) => ({
            type: mapErrorType(error.type),
            excerpt: error.excerpt,
            feedback: error.suggestion,
          })),
        },
      },
    });
  } catch {
    await prisma.analysis.update({
      where: { recordId },
      data: {
        status: "failed",
      },
    });
  }
}

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

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  try {
    const body = await req.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const analyzeNow = body.analyzeNow !== false;

    if (content.length < 20) {
      return apiError(422, "CONTENT_TOO_SHORT", "20자 이상 입력해 주세요.");
    }

    if (content.length > 500) {
      return apiError(422, "CONTENT_TOO_LONG", "500자를 초과할 수 없습니다.");
    }

    if (user.subscription?.tier === "free" && (await countMonthlyRecords(user.id)) >= FREE_LIMIT) {
      return apiError(429, "QUOTA_EXCEEDED", "무료 플랜의 월 기록 한도를 초과했습니다.");
    }

    if (analyzeNow && user.subscription?.tier === "free" && (await countMonthlyAnalyses(user.id)) >= FREE_LIMIT) {
      return apiError(429, "QUOTA_EXCEEDED", "무료 플랜의 월 분석 한도를 초과했습니다.");
    }

    const created = await prisma.record.create({
      data: {
        userId: user.id,
        content,
        analysis: {
          create: {
            id: randomUUID(),
            status: analyzeNow ? "pending" : "skipped",
          },
        },
      },
      include: {
        analysis: true,
      },
    });

    if (analyzeNow) {
      void runAnalysis(created.id);
    }

    return apiSuccess(
      {
        recordId: created.id,
        content: created.content,
        analysisStatus: created.analysis?.status ?? "skipped",
        createdAt: created.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return apiError(500, "INTERNAL_ERROR", "기록 저장 중 오류가 발생했습니다.");
  }
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return apiError(401, "UNAUTHENTICATED", "로그인이 필요합니다.");
  }

  const { page, limit } = parsePagination(req.nextUrl.searchParams);
  const total = await prisma.record.count({
    where: { userId: user.id },
  });

  const records: RecordWithAnalysis[] = await prisma.record.findMany({
    where: { userId: user.id },
    include: { analysis: true },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return apiSuccess(
    records.map((record) => ({
      recordId: record.id,
      content: record.content,
      analysisStatus: record.analysis?.status ?? "skipped",
      createdAt: record.createdAt.toISOString(),
      analyzedAt: record.analysis?.analyzedAt?.toISOString() ?? null,
    })),
    undefined,
    {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
  );
}
