"use client";

import { useTranslations } from "next-intl";

export default function FeedbackLoadingPage() {
  const t = useTranslations("feedback");
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6" role="status" aria-live="polite" aria-label={t("loadingFull")}>
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="font-semibold">{t("loadingFull")}</p>
        <p className="text-sm text-muted-foreground">{t("loadingDesc")}</p>
      </div>
    </div>
  );
}
