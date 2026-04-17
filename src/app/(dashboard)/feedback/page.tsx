"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpDown, Search, Sparkles } from "lucide-react";

import { parseApiResponse } from "@/shared/lib/client-api";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

type AnalysisStatus = "pending" | "completed" | "failed" | "skipped";

type FeedbackListItem = {
  recordId: string;
  content: string;
  analysisStatus: AnalysisStatus;
  createdAt: string;
  analyzedAt: string | null;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type FilterKey = "all" | Exclude<AnalysisStatus, "skipped">;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "completed", label: "분석 완료" },
  { key: "pending", label: "분석 중" },
  { key: "failed", label: "분석 실패" },
];

const statusClass: Record<AnalysisStatus, string> = {
  completed: "text-green-600",
  pending: "text-yellow-600",
  failed: "text-red-500",
  skipped: "text-muted-foreground",
};

const statusLabel: Record<AnalysisStatus, string> = {
  completed: "분석 완료",
  pending: "분석 중",
  failed: "분석 실패",
  skipped: "분석 없음",
};

const PAGE_SIZE = 12;

export default function FeedbackIndexPage() {
  const [allItems, setAllItems] = useState<FeedbackListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);

  const load = useCallback(async (p: number, q: string, s: "desc" | "asc") => {
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: String(PAGE_SIZE),
        sort: s,
        ...(q ? { search: q } : {}),
      });
      const res = await fetch(`/api/v1/records?${params}`, { cache: "no-store" });
      const json = await res.json();
      const data: FeedbackListItem[] = (json.data ?? []).filter(
        (item: FeedbackListItem) => item.analysisStatus !== "skipped"
      );
      setAllItems(data);
      setMeta(json.meta?.pagination ?? null);
    } catch {
      setAllItems([]);
    }
  }, []);

  useEffect(() => { void load(page, search, sort); }, [page, sort, load]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setActiveFilter("all");
      void load(1, search, sort);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const counts: Record<FilterKey, number> = {
    all: allItems.length,
    completed: allItems.filter((i) => i.analysisStatus === "completed").length,
    pending: allItems.filter((i) => i.analysisStatus === "pending").length,
    failed: allItems.filter((i) => i.analysisStatus === "failed").length,
  };

  const filtered =
    activeFilter === "all" ? allItems : allItems.filter((i) => i.analysisStatus === activeFilter);

  function toggleSort() {
    const next = sort === "desc" ? "asc" : "desc";
    setSort(next);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <div className="flex items-baseline gap-2">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Sparkles size={22} aria-hidden="true" />
            피드백
          </h1>
          {meta && (
            <span className="text-sm text-muted-foreground tabular-nums">
              총 {meta.total}건
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">분석 결과를 확인하세요.</p>
      </div>

      {/* 검색 + 정렬 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="기록 내용 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="피드백 검색"
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleSort}
          aria-label={sort === "desc" ? "최신순 정렬 중 — 오래된순으로 변경" : "오래된순 정렬 중 — 최신순으로 변경"}
          className="shrink-0 gap-1.5"
        >
          <ArrowUpDown size={14} aria-hidden="true" />
          {sort === "desc" ? "최신순" : "오래된순"}
        </Button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="분석 상태 필터">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeFilter === key}
            onClick={() => setActiveFilter(key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              activeFilter === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
            )}
          >
            {label}
            <span className={cn(
              "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
              activeFilter === key ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted"
            )}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {search ? `"${search}"에 해당하는 결과가 없습니다.` : "해당하는 분석 결과가 없습니다."}
          </CardContent>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.recordId} className="flex">
              <Link
                href={`/feedback/${item.recordId}`}
                className="flex w-full flex-col rounded-lg border p-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`피드백 상세 보기: ${item.content.slice(0, 30)}`}
              >
                <p className="line-clamp-4 flex-1 text-sm leading-relaxed">{item.content}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={cn("text-xs font-medium", statusClass[item.analysisStatus])}>
                    {statusLabel[item.analysisStatus]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.analyzedAt ?? item.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* 페이지네이션 */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2" role="navigation" aria-label="페이지 탐색">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label="이전 페이지"
          >
            이전
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            {page} / {meta.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            aria-label="다음 페이지"
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
