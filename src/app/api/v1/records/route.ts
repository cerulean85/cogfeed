import { randomUUID } from "node:crypto";

import { NextRequest } from "next/server";

import { analyzeRecord } from "@/entities/analysis";
import { apiError, apiSuccess, parsePagination } from "@/shared/lib/api";
import { createMockAnalysis, mapErrorType } from "@/shared/lib/analysis";
import { getCurrentUser } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";

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
        clarityScore: result.clarity_score,
        cognitiveErrors: {
          deleteMany: {},
          create: result.errors.map((error) => ({
            type: mapErrorType(error.type),
            severity: error.severity,
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

  const { searchParams } = req.nextUrl;

  // ?thisMonth=true → 이번 달 기록 수만 반환
  if (searchParams.get("thisMonth") === "true") {
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);

    const count = await prisma.record.count({
      where: { userId: user.id, createdAt: { gte: monthStart } },
    });

    return apiSuccess({ count });
  }

  const { page, limit } = parsePagination(searchParams);
  const search = searchParams.get("search")?.trim() || undefined;
  const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";

  const where = {
    userId: user.id,
    ...(search ? { content: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const total = await prisma.record.count({ where });

  const records: RecordWithAnalysis[] = await prisma.record.findMany({
    where,
    include: { analysis: true },
    orderBy: { createdAt: sort },
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
