import Link from "next/link";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { PrivacyEn, PrivacyKo } from "@/shared/ui/terms-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal");

  return {
    title: `${t("privacyTitle")} — CogFeed`,
  };
}

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  const t = await getTranslations("legal");

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-foreground">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">{t("privacyTitle")}</h1>
      </div>

      {locale === "en" ? <PrivacyEn /> : <PrivacyKo />}

      <div className="mt-10 border-t pt-6">
        <Link href="/register/terms" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
          {t("backToAgreement")}
        </Link>
      </div>
    </main>
  );
}
