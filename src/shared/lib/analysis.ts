import { randomUUID } from "node:crypto";

import type { AnalysisStatus, CognitiveErrorType } from "@prisma/client";

import type { AnalysisResult, CognitiveError } from "@/entities/analysis";

export type ApiAnalysisError = {
  type: string;
  label: string;
  excerpt: string;
  feedback: string;
};

type PrismaRecordWithAnalysis = {
  id: string;
  analysis: {
    id: string;
    status: AnalysisStatus;
    overallFeedback: string | null;
    analyzedAt: Date | null;
    cognitiveErrors: Array<{
      type: CognitiveErrorType;
      excerpt: string;
      feedback: string;
    }>;
  } | null;
};

export function createMockAnalysis(content: string): AnalysisResult {
  const normalized = content.toLowerCase();

  const errors: CognitiveError[] = [];

  if (normalized.includes("항상") || normalized.includes("절대")) {
    errors.push({
      type: "흑백 논리",
      type_en: "Black-and-White Thinking",
      severity: "medium",
      excerpt: content.slice(0, Math.min(content.length, 80)),
      explanation: "상황을 지나치게 이분법적으로 해석하는 표현이 보여요.",
      suggestion: "예외나 중간 가능성을 함께 적어 보세요.",
    });
  }

  if (normalized.includes("망했다") || normalized.includes("끝장")) {
    errors.push({
      type: "파국화",
      type_en: "Catastrophizing",
      severity: "high",
      excerpt: content.slice(0, Math.min(content.length, 80)),
      explanation: "결과를 최악으로 단정하는 경향이 보여요.",
      suggestion: "실제 가능한 결과를 최선, 보통, 최악으로 나눠 써 보세요.",
    });
  }

  return {
    errors,
    overall_feedback:
      errors.length === 0
        ? "기록이 비교적 차분하고 명확합니다. 근거와 예외를 조금만 더 덧붙이면 더 설득력 있어집니다."
        : "표현이 다소 단정적이거나 비관적으로 흐르는 부분이 있습니다. 판단의 근거와 대안을 함께 적으면 사고가 더 선명해집니다.",
    clarity_score: errors.length === 0 ? 88 : Math.max(45, 80 - errors.length * 18),
  };
}

export function toApiAnalysis(record: PrismaRecordWithAnalysis) {
  if (!record.analysis || record.analysis.status === "pending") {
    return {
      analysisId: record.analysis?.id ?? randomUUID(),
      recordId: record.id,
      status: "pending" as const,
      cognitiveErrors: [],
      overallFeedback: null,
      analyzedAt: null,
    };
  }

  if (record.analysis.status === "failed") {
    return {
      analysisId: record.analysis.id,
      recordId: record.id,
      status: "failed" as const,
      cognitiveErrors: [],
      overallFeedback: null,
      analyzedAt: null,
    };
  }

  if (record.analysis.status === "skipped") {
    return {
      analysisId: record.analysis.id,
      recordId: record.id,
      status: "skipped" as const,
      cognitiveErrors: [],
      overallFeedback: null,
      analyzedAt: null,
    };
  }

  return {
    analysisId: record.analysis.id,
    recordId: record.id,
    status: "completed" as const,
    cognitiveErrors: record.analysis.cognitiveErrors.map((error) => toApiPrismaError(error)),
    overallFeedback: record.analysis.overallFeedback ?? null,
    analyzedAt: record.analysis.analyzedAt?.toISOString() ?? null,
  };
}

function toApiPrismaError(error: {
  type: CognitiveErrorType;
  excerpt: string;
  feedback: string;
}): ApiAnalysisError {
  const labels: globalThis.Record<CognitiveErrorType, string> = {
    confirmation_bias: "확증 편향",
    availability_heuristic: "가용성 편향",
    anchoring: "앵커링 오류",
    black_and_white_thinking: "흑백 논리",
    overgeneralization: "과일반화",
    catastrophizing: "파국화",
  };

  return {
    type: error.type,
    label: labels[error.type],
    excerpt: error.excerpt,
    feedback: error.feedback,
  };
}
