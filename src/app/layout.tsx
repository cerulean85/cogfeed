import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CogFeed — 인지 오류 피드백 서비스",
  description: "AI가 당신의 기록을 분석해 인지 오류를 진단하고 개인화 피드백을 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
          {/* 접근성: 키보드 사용자를 위한 본문 바로가기 */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring"
          >
            본문 바로가기
          </a>
          {children}
        </body>
    </html>
  );
}
