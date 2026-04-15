import type { AnalysisResult } from "@/entities/analysis";
import { analyzeWithAnthropic } from "@/shared/ai/anthropic";
import { analyzeWithOpenAI } from "@/shared/ai/openai";

export type AIProvider = "anthropic" | "openai";

/**
 * 사용할 AI 프로바이더를 결정합니다.
 * 우선순위: 인자 > AI_PROVIDER 환경변수 > 기본값(anthropic)
 */
function resolveProvider(override?: AIProvider): AIProvider {
  if (override) return override;
  const env = process.env.AI_PROVIDER?.toLowerCase();
  if (env === "openai") return "openai";
  return "anthropic";
}

/**
 * 기록 내용을 AI로 분석합니다.
 *
 * @param content  분석할 기록 텍스트
 * @param provider 프로바이더 명시 (생략 시 AI_PROVIDER 환경변수 사용)
 */
export async function analyzeRecord(
  content: string,
  provider?: AIProvider
): Promise<AnalysisResult> {
  const resolved = resolveProvider(provider);

  switch (resolved) {
    case "openai":
      return analyzeWithOpenAI(content);
    case "anthropic":
      return analyzeWithAnthropic(content);
  }
}
