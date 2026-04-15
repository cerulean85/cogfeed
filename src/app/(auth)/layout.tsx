import Link from "next/link";
import { redirect } from "next/navigation";

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
        className="mb-8 text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        aria-label="CogFeed 홈으로 이동"
      >
        CogFeed
      </Link>
      {children}
    </div>
  );
}
