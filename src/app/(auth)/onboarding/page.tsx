"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { parseApiResponse } from "@/shared/lib/client-api";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const ONBOARDING_STEPS = [
  {
    step: 1,
    title: "생각을 기록하세요",
    description:
      "업무 중 떠오른 생각, 분석 메모, 글의 초안을 자유롭게 기록하세요. 형식은 중요하지 않습니다.",
    emoji: "✍️",
  },
  {
    step: 2,
    title: "AI가 인지 오류를 분석해요",
    description:
      "저장과 동시에 AI가 당신의 기록을 분석해 확증 편향, 앵커링 오류 등 인지 오류 패턴을 감지합니다.",
    emoji: "🔍",
  },
  {
    step: 3,
    title: "개인화 피드백을 받으세요",
    description:
      "단순 오류 지적이 아닌, 당신의 사고 패턴에 맞춘 구체적인 개선 방향을 제안합니다.",
    emoji: "💡",
  },
  {
    step: 4,
    title: "사고가 점점 명확해져요",
    description:
      "피드백을 반영할수록 인지 오류가 줄어들고, 더 명확하고 설득력 있는 사고를 갖게 됩니다.",
    emoji: "📈",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const step = ONBOARDING_STEPS[currentStep];
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;

  async function completeOnboarding() {
    const res = await fetch("/api/v1/onboarding/complete", { method: "PATCH" });
    await parseApiResponse(res);
  }

  async function handleNext() {
    if (isLast) {
      try {
        await completeOnboarding();
      } catch {
        // 인증 전 사용자는 기존 흐름대로 대시보드로 이동합니다.
      }
      router.push(callbackUrl);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <div className="text-5xl mb-2" aria-hidden="true">
          {step.emoji}
        </div>
        {/* 단계 인디케이터 */}
        <div
          className="flex justify-center gap-1.5 mb-4"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={ONBOARDING_STEPS.length}
          aria-label={`${ONBOARDING_STEPS.length}단계 중 ${currentStep + 1}단계`}
        >
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${
                i <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <CardTitle className="text-xl">{step.title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {step.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full"
          size="lg"
          onClick={handleNext}
          aria-label={isLast ? "대시보드로 이동" : "다음 단계"}
        >
          {isLast ? "시작하기" : "다음"}
        </Button>

        {/* 스킵 옵션 — AC: 스킵 버튼 제공 */}
        {!isLast && (
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={async () => {
              try {
                await completeOnboarding();
              } catch {
                // no-op
              }
              router.push(callbackUrl);
            }}
            aria-label="온보딩 건너뛰고 대시보드로 이동"
          >
            건너뛰기
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
