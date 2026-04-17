"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowUpDown, BookOpen, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { parseApiResponse } from "@/shared/lib/client-api";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";

type RecordListItem = {
  recordId: string;
  content: string;
  analysisStatus: "pending" | "completed" | "failed" | "skipped";
  createdAt: string;
  analyzedAt: string | null;
};

type PaginationMeta = { page: number; limit: number; total: number; totalPages: number };

const PAGE_SIZE = 12;

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations("records");
  const tc = useTranslations("common");

  const statusLabel: Record<RecordListItem["analysisStatus"], string> = {
    completed: t("statusCompleted"),
    pending: t("statusPending"),
    failed: t("statusFailed"),
    skipped: t("statusSkipped"),
  };
  const statusClass: Record<RecordListItem["analysisStatus"], string> = {
    completed: "text-green-600", pending: "text-yellow-600", failed: "text-red-500", skipped: "text-muted-foreground",
  };

  const load = useCallback(async (p: number, q: string, s: "desc" | "asc") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(PAGE_SIZE), sort: s, ...(q ? { search: q } : {}) });
      const res = await fetch(`/api/v1/records?${params}`, { cache: "no-store" });
      const json = await res.json();
      setRecords(json.data ?? []);
      setMeta(json.meta?.pagination ?? null);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => { void load(page, search, sort); }, [page, sort, load]);
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); void load(1, search, sort); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function removeRecord(recordId: string) {
    try {
      await fetch(`/api/v1/records/${recordId}`, { method: "DELETE" });
      void load(page, search, sort);
    } catch {
      setError(t("deleteError"));
    }
  }

  function toggleSort() { const next = sort === "desc" ? "asc" : "desc"; setSort(next); setPage(1); }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <BookOpen size={22} aria-hidden="true" />{t("title")}
            </h1>
            {meta && <span className="text-sm text-muted-foreground tabular-nums">{tc("total", { count: meta.total })}</span>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t("desc")}</p>
        </div>
        <Link href="/records/new" className={cn(buttonVariants())}>{t("newRecord")}</Link>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input type="search" placeholder={tc("searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={tc("searchAriaLabel")}
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={toggleSort}
          aria-label={sort === "desc" ? tc("sortAriaNewest") : tc("sortAriaOldest")} className="shrink-0 gap-1.5">
          <ArrowUpDown size={14} aria-hidden="true" />
          {sort === "desc" ? tc("newest") : tc("oldest")}
        </Button>
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      {isLoading ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-3 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-16" />
              </div>
            </li>
          ))}
        </ul>
      ) : records.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {search ? t("emptySearch", { search }) : t("empty")}
          </CardContent>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <li key={record.recordId} className="flex">
              <Card className="flex w-full flex-col">
                <CardHeader className="pb-2">
                  <p className="text-sm font-normal text-muted-foreground">{new Date(record.createdAt).toLocaleString()}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <p className="line-clamp-4 text-sm leading-relaxed">{record.content}</p>
                  <div className="space-y-3">
                    <p className={cn("text-xs font-medium", statusClass[record.analysisStatus])}>{statusLabel[record.analysisStatus]}</p>
                    <div className="flex gap-2">
                      <Link href={`/feedback/${record.recordId}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 justify-center")}>
                        {t("viewFeedback")}
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger render={
                          <Button type="button" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label={t("deleteRecord")}>
                            {tc("delete")}
                          </Button>
                        } />
                        <AlertDialogContent size="sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("deleteConfirmDesc")}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeRecord(record.recordId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              {tc("delete")}
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

      {!isLoading && meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2" role="navigation" aria-label={tc("pageNav")}>
          <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label={tc("prevPage")}>{tc("prev")}</Button>
          <span className="text-sm text-muted-foreground tabular-nums">{tc("pageOf", { page, total: meta.totalPages })}</span>
          <Button type="button" variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} aria-label={tc("nextPage")}>{tc("next")}</Button>
        </div>
      )}
    </div>
  );
}
