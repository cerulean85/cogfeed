"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpDown, BookOpen, Search } from "lucide-react";

import { parseApiResponse } from "@/shared/lib/client-api";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";

type RecordListItem = {
  recordId: string;
  content: string;
  analysisStatus: "pending" | "completed" | "failed" | "skipped";
  createdAt: string;
  analyzedAt: string | null;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const statusLabel: Record<RecordListItem["analysisStatus"], string> = {
  completed: "분석 완료",
  pending: "분석 중",
  failed: "분석 실패",
  skipped: "분석 없음",
};

const statusClass: Record<RecordListItem["analysisStatus"], string> = {
  completed: "text-green-600",
  pending: "text-yellow-600",
  failed: "text-red-500",
  skipped: "text-muted-foreground",
};

const PAGE_SIZE = 12;

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      setRecords(json.data ?? []);
      setMeta(json.meta?.pagination ?? null);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "기록을 불러오지 못했습니다.");
    }
  }, []);

  useEffect(() => { void load(page, search, sort); }, [page, sort, load]);

  // 검색은 입력 후 300ms 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      void load(1, search, sort);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function removeRecord(recordId: string) {
    try {
      await fetch(`/api/v1/records/${recordId}`, { method: "DELETE" });
      void load(page, search, sort);
    } catch {
      setError("기록 삭제에 실패했습니다.");
    }
  }

  function toggleSort() {
    const next = sort === "desc" ? "asc" : "desc";
    setSort(next);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <BookOpen size={22} aria-hidden="true" />
              기록 관리
            </h1>
            {meta && (
              <span className="text-sm text-muted-foreground tabular-nums">
                총 {meta.total}건
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">작성한 기록과 분석 상태를 확인하세요.</p>
        </div>
        <Link href="/records/new" className={cn(buttonVariants())}>새 기록</Link>
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
            aria-label="기록 검색"
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

      {error && (
        <p role="alert" className="text-sm text-destructive">{error}</p>
      )}

      {/* 목록 */}
      {records.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {search ? `"${search}"에 해당하는 기록이 없습니다.` : "아직 기록이 없습니다. 첫 기록을 작성해 보세요."}
          </CardContent>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <li key={record.recordId} className="flex">
              <Card className="flex w-full flex-col">
                <CardHeader className="pb-2">
                  <p className="text-sm font-normal text-muted-foreground">
                    {new Date(record.createdAt).toLocaleString("ko-KR")}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <p className="line-clamp-4 text-sm leading-relaxed">{record.content}</p>
                  <div className="space-y-3">
                    <p className={cn("text-xs font-medium", statusClass[record.analysisStatus])}>
                      {statusLabel[record.analysisStatus]}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/feedback/${record.recordId}`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 justify-center")}
                      >
                        피드백 보기
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              aria-label="기록 삭제"
                            >
                              삭제
                            </Button>
                          }
                        />
                        <AlertDialogContent size="sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle>기록 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              이 기록을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠어요?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeRecord(record.recordId)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
