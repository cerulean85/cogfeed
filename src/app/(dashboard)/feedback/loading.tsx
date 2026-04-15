/**
 * Next.js Streaming — 분석 완료 전까지 이 화면을 표시
 * Suspense boundary로 피드백 페이지가 렌더링될 때까지 사용자에게 피드백 제공
 */
export default function FeedbackLoadingPage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] gap-6"
      role="status"
      aria-live="polite"
      aria-label="분석 중입니다"
    >
      {/* 스피너 */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>

      <div className="text-center space-y-1">
        <p className="font-semibold">AI가 분석 중입니다...</p>
        <p className="text-sm text-muted-foreground">
          인지 오류 패턴을 탐지하고 있습니다. 잠시만 기다려 주세요.
        </p>
      </div>
    </div>
  );
}
