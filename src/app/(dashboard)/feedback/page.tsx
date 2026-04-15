"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { parseApiResponse } from "@/shared/lib/client-api";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

type FeedbackListItem = {
  recordId: string;
  content: string;
  analysisStatus: "pending" | "completed" | "failed" | "skipped";
  createdAt: string;
  analyzedAt: string | null;
};

export default function FeedbackIndexPage() {
  const [items, setItems] = useState<FeedbackListItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/records?page=1&limit=20", { cache: "no-store" });
        const data = await parseApiResponse<FeedbackListItem[]>(res);
        setItems(data.filter((item) => item.analysisStatus !== "skipped"));
      } catch {
        setItems([]);
      }
    }

    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">피드백</h1>
        <p className="mt-1 text-sm text-muted-foreground">최근 분석 결과를 확인하세요.</p>
      </div>

      {items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            아직 분석 결과가 없습니다.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.recordId}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.analysisStatus}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-2 text-sm">{item.content}</p>
                  <Link
                    href={`/feedback/${item.recordId}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    상세 보기
                  </Link>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
