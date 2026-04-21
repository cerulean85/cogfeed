import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Brain } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "@/auth";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { Footer } from "@/shared/ui/footer";
import { LocaleSwitcher } from "@/shared/ui/locale-switcher";
import { siteMeta } from "@/shared/config/site";
import { getSiteConfig } from "@/shared/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = locale === "en" ? siteMeta.en : siteMeta.ko;
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: siteMeta.url,
      locale: locale === "en" ? "en_US" : "ko_KR",
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function HomePage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  const locale = await getLocale();
  const meta = locale === "en" ? siteMeta.en : siteMeta.ko;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteMeta.name,
    url: siteMeta.url,
    description: meta.description,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    inLanguage: ["ko", "en"],
  };

  const coupangSrc = await getSiteConfig("coupang_iframe_src_3") ?? "https://coupa.ng/cmr69p";
  const t = await getTranslations("landing");
  const ta = await getTranslations("auth");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed right-4 top-[calc(1rem+env(safe-area-inset-top))]">
        <LocaleSwitcher />
      </div>
      <div className="w-full max-w-md space-y-8 text-center">
        {/* 서비스 브랜드 */}
        <div className="space-y-3">
          <h1 className="flex items-center justify-center gap-3 text-4xl font-bold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-500">
              <Brain size={22} aria-hidden="true" />
            </span>
            CogFeed
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
            {t("tagline")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/register/terms"
            className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
          >
            {t("signUp")}
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full justify-center")}
          >
            {ta("loginButton")}
          </Link>
        </div>
        {/* 쿠팡 파트너스 배너 */}
        <div className="mt-8 flex flex-col items-center">
          <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <iframe
              src={coupangSrc}
              width="200"
              height="240"
              referrerPolicy="unsafe-url"
              style={{ display: "block", border: 0, overflow: "hidden" }}
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
