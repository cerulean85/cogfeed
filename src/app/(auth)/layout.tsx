import Link from "next/link";
import { redirect } from "next/navigation";
import { Brain } from "lucide-react";

import { auth } from "@/auth";
import { Footer } from "@/shared/ui/footer";
import { LocaleSwitcher } from "@/shared/ui/locale-switcher";
import { getSiteConfig } from "@/shared/lib/site-config";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  const coupangSrc = await getSiteConfig("coupang_iframe_src_2") ?? "https://coupa.ng/cmr68w";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* 언어 전환 — 우상단 고정 */}
      <div className="fixed right-4 top-[calc(1rem+env(safe-area-inset-top))]">
        <LocaleSwitcher />
      </div>

      {/* 브랜드 로고 — 항상 접근 가능 */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
        aria-label="CogFeed 홈으로 이동"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white">
          <Brain size={18} aria-hidden="true" />
        </span>
        CogFeed
      </Link>
      {children}

      {/* 쿠팡 파트너스 배너 */}
      <div className="mt-8 flex flex-col items-center">
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <iframe
            src={coupangSrc}
            width="200"
            height="240"
            frameBorder="0"
            scrolling="no"
            referrerPolicy="unsafe-url"
            style={{ display: "block" }}
          />
        </div>
      </div>

      <Footer className="mt-8" />
    </div>
  );
}
