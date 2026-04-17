"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { parseApiResponse } from "@/shared/lib/client-api";
import { safeCallbackUrl } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("onboarding");
  const [currentStep, setCurrentStep] = useState(0);
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));

  const STEPS = [
    { emoji: "✍️", titleKey: "step1Title" as const, descKey: "step1Desc" as const },
    { emoji: "🔍", titleKey: "step2Title" as const, descKey: "step2Desc" as const },
    { emoji: "💡", titleKey: "step3Title" as const, descKey: "step3Desc" as const },
    { emoji: "📈", titleKey: "step4Title" as const, descKey: "step4Desc" as const },
  ];

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  async function completeOnboarding() {
    const res = await fetch("/api/v1/onboarding/complete", { method: "PATCH" });
    await parseApiResponse(res);
  }

  async function handleNext() {
    if (isLast) {
      try { await completeOnboarding(); } catch { /* no-op */ }
      router.push(callbackUrl);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="text-5xl mb-2" aria-hidden="true">{step.emoji}</div>
        <div
          className="flex justify-center gap-1.5 mb-4"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-label={t("stepIndicator", { current: currentStep + 1, total: STEPS.length })}
        >
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= currentStep ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <CardTitle className="text-xl">{t(step.titleKey)}</CardTitle>
        <CardDescription className="text-base leading-relaxed">{t(step.descKey)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" size="lg" onClick={handleNext}>
          {isLast ? t("start") : t("next")}
        </Button>
        {!isLast && (
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={async () => {
            try { await completeOnboarding(); } catch { /* no-op */ }
            router.push(callbackUrl);
          }}>
            {t("skip")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
