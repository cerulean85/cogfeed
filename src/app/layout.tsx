import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale, getTranslations } from "next-intl/server";
import { Providers } from "./providers";
import { PwaRegister } from "@/shared/ui/pwa-register";
import { siteMeta } from "@/shared/config/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#7c3aed",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = locale === "en" ? siteMeta.en : siteMeta.ko;

  return {
    metadataBase: new URL(siteMeta.url),
    title: {
      default: meta.title,
      template: `%s — CogFeed`,
    },
    description: meta.description,
    keywords: ["인지 오류", "AI 피드백", "사고 분석", "cognitive bias", "AI feedback", "CogFeed"],
    authors: [{ name: "CogFeed" }],
    openGraph: {
      type: "website",
      siteName: siteMeta.name,
      title: meta.title,
      description: meta.description,
      url: siteMeta.url,
      locale: locale === "en" ? "en_US" : "ko_KR",
      alternateLocale: locale === "en" ? "ko_KR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
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
    icons: {
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "CogFeed",
      startupImage: "/icons/apple-touch-icon.png",
    },
    other: {
      "mobile-web-app-capable": "yes",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <html lang={locale} className="h-full antialiased" suppressHydrationWarning>

      <body className="min-h-full flex flex-col">
          {/* 접근성: 키보드 사용자를 위한 본문 바로가기 */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring"
          >
            {t("skipToContent")}
          </a>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
          <PwaRegister />
        </body>
    </html>
  );
}
