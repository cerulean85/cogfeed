import type { AnalysisResult } from "@/entities/analysis";

export type Record = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  analysis: AnalysisResult | null;
  analysisId: string | null;
  analysisStatus: "pending" | "completed" | "failed" | "skipped";
  analysisRetryCount: number;
  analyzedAt: string | null;
};
