"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { parseApiResponse } from "@/shared/lib/client-api";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type RecordListItem = {
  recordId: string;
  content: string;
  analysisStatus: "pending" | "completed" | "failed" | "skipped";
  createdAt: string;
  analyzedAt: string | null;
};

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/v1/records?page=1&limit=20", { cache: "no-store" });
      const data = await parseApiResponse<RecordListItem[]>(res);
      setRecords(data);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "기록을 불러오지 못했습니다.");
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadOnMount() {
      try {
        const res = await fetch("/api/v1/records?page=1&limit=20", { cache: "no-store" });
        const data = await parseApiResponse<RecordListItem[]>(res);
        if (!cancelled) {
          setRecords(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "기록을 불러오지 못했습니다.");
        }
      }
    }

    void loadOnMount();

    return () => {
      cancelled = true;
    };
  }, []);

  async function removeRecord(recordId: string) {
    try {
      await parseApiResponse(await fetch(`/api/v1/records/${recordId}`, { method: "DELETE" }));
      await load();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "기록 삭제에 실패했습니다.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">기록 관리</h1>
          <p className="mt-1 text-sm text-muted-foreground">작성한 기록과 분석 상태를 확인하세요.</p>
        </div>
        <Link href="/records/new" className={cn(buttonVariants())}>
          새 기록
        </Link>
      </div>

      {error && (
        <Card>
          <CardContent className="py-4 text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      )}

      {records.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            아직 기록이 없습니다. 첫 기록을 작성해 보세요.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {records.map((record) => (
            <li key={record.recordId}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {new Date(record.createdAt).toLocaleString("ko-KR")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-3 text-sm">{record.content}</p>
                  <p className="text-xs text-muted-foreground">
                    분석 상태: {record.analysisStatus}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/feedback/${record.recordId}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      피드백 보기
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRecord(record.recordId)}
                    >
                      삭제
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
