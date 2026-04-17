"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/utils";
import { parseApiResponse } from "@/shared/lib/client-api";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

type RecordDetail = { recordId: string; content: string; analysisStatus: "pending" | "completed" | "failed" | "skipped"; createdAt: string; updatedAt: string };
type CognitiveErrorSeverity = "low" | "medium" | "high";
type AnalysisDetail = {
  analysisId: string; recordId: string; status: "pending" | "completed" | "failed" | "skipped";
  cognitiveErrors: Array<{ type: string; label: string; severity: CognitiveErrorSeverity; excerpt: string; feedback: string }>;
  overallFeedback: string | null; clarityScore: number | null; analyzedAt: string | null;
};

export default function FeedbackPage() {
  const params = useParams<{ id: string }>();
  const recordId = typeof params.id === "string" ? params.id : null;
  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("feedback");
  const tc = useTranslations("common");

  const severityLabel: Record<CognitiveErrorSeverity, string> = { low: t("severityLow"), medium: t("severityMedium"), high: t("severityHigh") };
  const severityClass: Record<CognitiveErrorSeverity, string> = { low: "text-blue-600 bg-blue-50", medium: "text-yellow-700 bg-yellow-50", high: "text-red-600 bg-red-50" };

  useEffect(() => {
    if (!recordId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function load() {
      try {
        const recordRes = await fetch(`/api/v1/records/${recordId}`, { cache: "no-store" });
        const recordData = await parseApiResponse<RecordDetail>(recordRes);
        if (cancelled) return;
        setRecord(recordData);
        const analysisRes = await fetch(`/api/v1/records/${recordId}/analysis`, { cache: "no-store" });
        const analysisData = await parseApiResponse<AnalysisDetail>(analysisRes);
        if (cancelled) return;
        setAnalysis(analysisData);
        setError(null);
        if (analysisData.status === "pending") timer = setTimeout(load, 1200);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : t("loadError"));
      }
    }

    void load();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [recordId, t]);

  async function retryAnalysis() {
    if (!recordId) return;
    try {
      setError(null);
      await parseApiResponse(await fetch(`/api/v1/records/${recordId}/analysis/retry`, { method: "POST" }));
      const analysisRes = await fetch(`/api/v1/records/${recordId}/analysis`, { cache: "no-store" });
      setAnalysis(await parseApiResponse<AnalysisDetail>(analysisRes));
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : t("retryError"));
    }
  }

  if (error && !record) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <Card><CardContent className="py-6"><p className="text-sm text-muted-foreground">{error}</p></CardContent></Card>
        <Link href="/records" className={cn(buttonVariants({ variant: "outline" }))}>{t("goToRecords")}</Link>
      </div>
    );
  }

  if (!record || !analysis) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="rounded-lg border p-4 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="rounded-lg border p-6 space-y-4">
          <Skeleton className="h-5 w-28" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
        <div className="rounded-lg border p-6 space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("detailDesc")}</p>
      </div>

      <Card className="bg-muted/40">
        <CardHeader className="pb-2"><CardDescription>{t("yourRecord")}</CardDescription></CardHeader>
        <CardContent><p className="whitespace-pre-wrap text-sm leading-relaxed">{record.content}</p></CardContent>
      </Card>

      {analysis.status === "pending" && <Card><CardContent className="py-6"><p className="text-sm text-muted-foreground">{t("analyzing")}</p></CardContent></Card>}
      {analysis.status === "skipped" && <Card><CardContent className="py-6"><p className="text-sm text-muted-foreground">{t("skipped")}</p></CardContent></Card>}
      {analysis.status === "failed" && (
        <Card>
          <CardContent className="space-y-3 py-6">
            <p className="text-sm text-destructive">{t("failed")}</p>
            <button type="button" onClick={retryAnalysis} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>{tc("retry")}</button>
          </CardContent>
        </Card>
      )}

      {analysis.status === "completed" && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t("analysisResult")}</CardTitle>
              <CardDescription>{analysis.analyzedAt ? new Date(analysis.analyzedAt).toLocaleString() : t("analysisResult")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.cognitiveErrors.length === 0 ? (
                <p className="text-sm">{t("noErrors")}</p>
              ) : (
                <ul className="space-y-4">
                  {analysis.cognitiveErrors.map((item, index) => (
                    <li key={`${item.type}-${index}`} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.label}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", severityClass[item.severity])} aria-label={t("severityAriaLabel", { severity: severityLabel[item.severity] })}>
                          {severityLabel[item.severity]}
                        </span>
                      </div>
                      <blockquote className="mt-2 border-l-2 border-muted pl-3 text-sm text-muted-foreground">&quot;{item.excerpt}&quot;</blockquote>
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
                <CardTitle className="text-base">{t("clarityScore")}</CardTitle>
                <CardDescription>{t("clarityRange")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-3xl font-bold" aria-label={`${t("clarityScore")} ${analysis.clarityScore}`}>
                  {analysis.clarityScore}<span className="ml-1 text-base font-normal text-muted-foreground">/ 100</span>
                </p>
                <div role="progressbar" aria-valuenow={analysis.clarityScore} aria-valuemin={0} aria-valuemax={100} className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary transition-all" style={{ width: `${analysis.clarityScore}%` }} />
                </div>
              </CardContent>
            </Card>
          )}

          {analysis.overallFeedback && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2"><CardTitle className="text-base">{t("overallFeedback")}</CardTitle></CardHeader>
              <CardContent><p className="text-sm leading-relaxed">{analysis.overallFeedback}</p></CardContent>
            </Card>
          )}
        </>
      )}

      <p className="text-xs text-muted-foreground rounded-md border px-4 py-3 leading-relaxed">{t("disclaimer")}</p>

      <div className="flex gap-3 pt-2">
        <Link href="/records/new" className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center sm:flex-none")}>{t("writeAgain")}</Link>
        <Link href="/records" className={cn(buttonVariants(), "flex-1 justify-center sm:flex-none")}>{t("recordList")}</Link>
      </div>
    </div>
  );
}
