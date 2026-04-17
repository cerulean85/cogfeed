import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* 서비스 브랜드 */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">CogFeed</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            AI가 당신의 기록을 분석해
            <br />
            인지 오류를 진단하고 개인화 피드백을 제공합니다.
          </p>
        </div>

        {/* CTA 영역 — 회원가입이 primary CTA */}
        <div className="flex flex-col gap-3">
          <Link
            href="/register/terms"
            className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
            aria-label="회원가입 페이지로 이동"
          >
            회원가입
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full justify-center")}
            aria-label="로그인 페이지로 이동"
          >
            로그인
          </Link>
        </div>

        {/* 비회원 탐색 — AC: "둘러보기" 버튼 제공 */}
        <p className="text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            둘러보기 (비회원)
          </Link>
        </p>
        {/* 쿠팡 파트너스 배너 */}
        <div className="mt-8 flex flex-col items-center">
          <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <iframe
              src="https://coupa.ng/cmpW0U"
              width="200"
              height="240"
              frameBorder="0"
              scrolling="no"
              referrerPolicy="unsafe-url"
              style={{ display: "block" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
