import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisResult } from "@/entities/analysis";
import { SYSTEM_PROMPT, parseJsonResponse } from "./prompt";

const DEFAULT_MODEL = "claude-sonnet-4-5";

export async function analyzeWithAnthropic(content: string): Promise<AnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: `다음 기록을 분석해 주세요:\n\n${content}` }],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected content block type from Anthropic");

  return parseJsonResponse(block.text) as AnalysisResult;
}
