import Link from "next/link";
import { redirect } from "next/navigation";
import { Brain } from "lucide-react";

import { auth } from "@/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* 브랜드 로고 — 항상 접근 가능 */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-2xl font-bold tracking-tight transition-opacity hover:opacity-80"
        aria-label="CogFeed 홈으로 이동"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-500">
          <Brain size={18} aria-hidden="true" />
        </span>
        CogFeed
      </Link>
      {children}

      {/* 쿠팡 파트너스 배너 */}
      <div className="mt-8 flex flex-col items-center">
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <iframe
            src="https://coupa.ng/cmrXfF"
            width="120"
            height="240"
            frameBorder="0"
            scrolling="no"
            referrerPolicy="unsafe-url"
            style={{ display: "block" }}
            {...{ browsingtopics: "" }}
          />
        </div>
      </div>
    </div>
  );
}
