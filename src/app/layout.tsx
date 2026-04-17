import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Providers } from "./providers";
import { siteMeta } from "@/shared/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.ko.title,
    template: `%s — CogFeed`,
  },
  description: siteMeta.ko.description,
  keywords: ["인지 오류", "AI 피드백", "사고 분석", "cognitive bias", "AI feedback", "CogFeed"],
  authors: [{ name: "CogFeed" }],
  openGraph: {
    type: "website",
    siteName: siteMeta.name,
    title: siteMeta.ko.title,
    description: siteMeta.ko.description,
    url: siteMeta.url,
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.ko.title,
    description: siteMeta.ko.description,
  },
  alternates: {
    canonical: siteMeta.url,
    languages: {
      "ko": siteMeta.url,
      "en": siteMeta.url,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "loNSOty856dOFy4duEtSaGM65UCZ0Asu1oXku680W-g",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased" suppressHydrationWarning>

      <body className="min-h-full flex flex-col">
          {/* 접근성: 키보드 사용자를 위한 본문 바로가기 */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring"
          >
            본문 바로가기
          </a>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </body>
    </html>
  );
}
