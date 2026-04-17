"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";

import { parseApiResponse } from "@/shared/lib/client-api";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

type RecordItem = {
  recordId: string;
  content: string;
  analysisStatus: "pending" | "completed" | "failed" | "skipped";
  createdAt: string;
};

export function DashboardView() {
  const [recentRecords, setRecentRecords] = useState<RecordItem[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState(0);
  const t = useTranslations("dashboard");

  useEffect(() => {
    async function load() {
      try {
        const [recordsRes, countRes] = await Promise.all([
          fetch("/api/v1/records?page=1&limit=5", { cache: "no-store" }),
          fetch("/api/v1/records?thisMonth=true", { cache: "no-store" }),
        ]);
        if (recordsRes.ok) setRecentRecords(await parseApiResponse<RecordItem[]>(recordsRes));
        if (countRes.ok) {
          const { count } = await parseApiResponse<{ count: number }>(countRes);
          setMonthlyRecords(count);
        }
      } catch {
        setRecentRecords([]);
      }
    }
    void load();
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Home size={22} aria-hidden="true" />
          {t("title")}
        </h1>
        <Link href="/records/new" className={cn(buttonVariants({ size: "sm" }))} aria-label={t("addRecord")}>
          {t("addRecord")}
        </Link>
      </div>

      <section aria-labelledby="monthly-stats-heading">
        <h2 id="monthly-stats-heading" className="sr-only">{t("monthlyCount")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t("monthlyCount")}</CardDescription>
              <CardTitle className="text-3xl" aria-label={`${t("monthlyCount")} ${monthlyRecords}`}>
                {monthlyRecords}
                {t("unit") && <span className="ml-1 text-base font-normal text-muted-foreground">{t("unit")}</span>}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section aria-labelledby="recent-records-heading">
        <h2 id="recent-records-heading" className="mb-3 text-lg font-semibold">{t("recentRecords")}</h2>
        {recentRecords.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <p className="text-muted-foreground whitespace-pre-line">{t("noRecords")}</p>
              <Link href="/records/new" className={cn(buttonVariants())}>{t("writeRecord")}</Link>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-3" aria-label={t("recentRecords")}>
            {recentRecords.map((record) => (
              <li key={record.recordId}>
                <Link
                  href={`/feedback/${record.recordId}`}
                  className="block rounded-lg border p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={t("recordAriaLabel", { content: record.content })}
                >
                  <p className="line-clamp-2 text-sm">{record.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(record.createdAt).toLocaleString()} · {record.analysisStatus}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
