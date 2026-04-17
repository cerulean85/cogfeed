"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { cn } from "@/shared/lib/utils";
import { parseApiResponse } from "@/shared/lib/client-api";
import { buttonVariants } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

type RecordDetail = {
  recordId: string;
  content: string;
  analysisStatus: "pending" | "completed" | "failed" | "skipped";
  createdAt: string;
  updatedAt: string;
};

type CognitiveErrorSeverity = "low" | "medium" | "high";

type AnalysisDetail = {
  analysisId: string;
  recordId: string;
  status: "pending" | "completed" | "failed" | "skipped";
  cognitiveErrors: Array<{
    type: string;
    label: string;
    severity: CognitiveErrorSeverity;
    excerpt: string;
    feedback: string;
  }>;
  overallFeedback: string | null;
  clarityScore: number | null;
  analyzedAt: string | null;
};

const severityLabel: Record<CognitiveErrorSeverity, string> = {
  low: "낮음",
  medium: "중간",
  high: "높음",
};

const severityClass: Record<CognitiveErrorSeverity, string> = {
  low: "text-blue-600 bg-blue-50",
  medium: "text-yellow-700 bg-yellow-50",
  high: "text-red-600 bg-red-50",
};

export default function FeedbackPage() {
  const params = useParams<{ id: string }>();
  const recordId = typeof params.id === "string" ? params.id : null;
  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordId) {
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function load() {
      try {
        const recordRes = await fetch(`/api/v1/records/${recordId}`, { cache: "no-store" });
        const recordData = await parseApiResponse<RecordDetail>(recordRes);
        if (cancelled) {
          return;
        }
        setRecord(recordData);

        const analysisRes = await fetch(`/api/v1/records/${recordId}/analysis`, { cache: "no-store" });
        const analysisData = await parseApiResponse<AnalysisDetail>(analysisRes);
        if (cancelled) {
          return;
        }
        setAnalysis(analysisData);
        setError(null);

        if (analysisData.status === "pending") {
          timer = setTimeout(load, 1200);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "피드백을 불러오지 못했습니다.");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [recordId]);

  async function retryAnalysis() {
    if (!recordId) {
      return;
    }

    try {
      setError(null);
      await parseApiResponse(
        await fetch(`/api/v1/records/${recordId}/analysis/retry`, { method: "POST" })
      );
      const analysisRes = await fetch(`/api/v1/records/${recordId}/analysis`, { cache: "no-store" });
      const analysisData = await parseApiResponse<AnalysisDetail>(analysisRes);
      setAnalysis(analysisData);
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : "분석 재시도에 실패했습니다.");
    }
  }

  if (error && !record) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">피드백</h1>
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
        <Link href="/records" className={cn(buttonVariants({ variant: "outline" }))}>
          기록 목록으로 이동
        </Link>
      </div>
    );
  }

  if (!record || !analysis) {
    return <div className="text-sm text-muted-foreground">피드백을 불러오는 중입니다...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">피드백</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          AI가 분석한 인지 오류와 개선 방향입니다.
        </p>
      </div>

      <Card className="bg-muted/40">
        <CardHeader className="pb-2">
          <CardDescription>작성한 기록</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{record.content}</p>
        </CardContent>
      </Card>

      {analysis.status === "pending" && (
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">분석 중입니다. 잠시만 기다려 주세요.</p>
          </CardContent>
        </Card>
      )}

      {analysis.status === "skipped" && (
        <Card>
          <CardContent className="py-6">
            <p className="text-sm text-muted-foreground">이 기록은 저장만 되었고 분석은 건너뛰었습니다.</p>
          </CardContent>
        </Card>
      )}

      {analysis.status === "failed" && (
        <Card>
          <CardContent className="space-y-3 py-6">
            <p className="text-sm text-destructive">분석에 실패했습니다. 다시 시도해 주세요.</p>
            <button
              type="button"
              onClick={retryAnalysis}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              재시도
            </button>
          </CardContent>
        </Card>
      )}

      {analysis.status === "completed" && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">분석 결과</CardTitle>
              <CardDescription>
                {analysis.analyzedAt
                  ? new Date(analysis.analyzedAt).toLocaleString("ko-KR")
                  : "분석 완료"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.cognitiveErrors.length === 0 ? (
                <p className="text-sm">인지 오류가 발견되지 않았습니다.</p>
              ) : (
                <ul className="space-y-4">
                  {analysis.cognitiveErrors.map((item, index) => (
                    <li key={`${item.type}-${index}`} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.label}</p>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            severityClass[item.severity]
                          )}
                          aria-label={`심각도: ${severityLabel[item.severity]}`}
                        >
                          {severityLabel[item.severity]}
                        </span>
                      </div>
                      <blockquote className="mt-2 border-l-2 border-muted pl-3 text-sm text-muted-foreground">
                        &quot;{item.excerpt}&quot;
                      </blockquote>
                      <p className="mt-2 text-sm">{item.feedback}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {analysis.clarityScore !== null && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">사고 명확도</CardTitle>
                <CardDescription>0(낮음) — 100(높음)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-bold" aria-label={`사고 명확도 ${analysis.clarityScore}점`}>
                  {analysis.clarityScore}
                  <span className="ml-1 text-base font-normal text-muted-foreground">/ 100</span>
                </p>
                <div
                  role="progressbar"
                  aria-valuenow={analysis.clarityScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`사고 명확도 ${analysis.clarityScore}%`}
                  className="h-2 w-full overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${analysis.clarityScore}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {analysis.overallFeedback && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">전체 피드백</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.overallFeedback}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href="/records/new"
          className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center sm:flex-none")}
        >
          다시 작성
        </Link>
        <Link href="/records" className={cn(buttonVariants(), "flex-1 justify-center sm:flex-none")}>
          기록 목록
        </Link>
      </div>
    </div>
  );
}
