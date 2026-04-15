import OpenAI from "openai";
import type { AnalysisResult } from "@/entities/analysis";
import { SYSTEM_PROMPT, parseJsonResponse } from "./prompt";

const DEFAULT_MODEL = "gpt-4o";

export async function analyzeWithOpenAI(content: string): Promise<AnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;

  const response = await client.chat.completions.create({
    model,
    max_tokens: 1024,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `다음 기록을 분석해 주세요:\n\n${content}` },
    ],
  });

  const raw = response.choices[0]?.message.content;
  if (!raw) throw new Error("Empty response from OpenAI");

  return parseJsonResponse(raw) as AnalysisResult;
}
