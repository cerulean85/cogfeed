import { Skeleton } from "@/shared/ui/skeleton";

export default function FeedbackDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* 기록 카드 */}
      <div className="rounded-lg border p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* 분석 결과 카드 */}
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

      {/* 명확성 점수 카드 */}
      <div className="rounded-lg border p-6 space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 sm:flex-none sm:w-32" />
        <Skeleton className="h-10 flex-1 sm:flex-none sm:w-32" />
      </div>
    </div>
  );
}
