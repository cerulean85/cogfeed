"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { parseApiResponse } from "@/shared/lib/client-api";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";

type SubscriptionData = {
  tier: "free" | "premium";
  status: "active" | "expired" | "canceled";
  currentPeriodEnd: string | null;
  usage: {
    recordsThisMonth: number;
    recordsLimit: number | null;
    analysisThisMonth: number;
    analysisLimit: number | null;
  };
};

const TIERS = [
  {
    id: "free",
    name: "무료",
    price: "0원",
    period: "",
    description: "CogFeed를 처음 경험해 보세요.",
    features: ["월 10회 기록 작성", "월 10회 AI 인지 오류 분석", "기본 피드백 제공"],
    limitations: ["데이터 시각화 미제공", "기록 히스토리 30일 보관"],
    cta: "현재 플랜",
    ctaHref: "/dashboard",
    highlight: false,
  },
  {
    id: "premium",
    name: "프리미엄",
    price: "9,900원",
    period: "/ 월",
    description: "인지 오류 개선에 집중하는 분들을 위해.",
    features: [
      "무제한 기록 작성",
      "무제한 AI 인지 오류 분석",
      "개인화 피드백 심층 제공",
      "데이터 시각화 & 트렌드 분석",
      "기록 히스토리 무제한 보관",
    ],
    limitations: [],
    cta: "프리미엄 시작",
    ctaHref: "/settings/subscription/checkout",
    highlight: true,
  },
] as const;

export function SubscriptionView() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/v1/subscription", { cache: "no-store" });
      const data = await parseApiResponse<SubscriptionData>(res);
      setSubscription(data);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "구독 정보를 불러오지 못했습니다.");
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadOnMount() {
      try {
        const res = await fetch("/api/v1/subscription", { cache: "no-store" });
        const data = await parseApiResponse<SubscriptionData>(res);
        if (!cancelled) {
          setSubscription(data);
          setError(null);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "구독 정보를 불러오지 못했습니다.");
        }
      }
    }

    void loadOnMount();

    return () => {
      cancelled = true;
    };
  }, []);

  async function cancelSubscription() {
    try {
      await parseApiResponse(await fetch("/api/v1/subscription/cancel", { method: "POST" }));
      await load();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "구독 취소에 실패했습니다.");
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">구독 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">광고 없이 모든 기능을 온전히 사용하세요.</p>
      </div>

      {subscription && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">현재 구독 상태</CardTitle>
            <CardDescription>
              {subscription.tier} / {subscription.status}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>이번 달 기록 수: {subscription.usage.recordsThisMonth}</p>
            <p>이번 달 분석 수: {subscription.usage.analysisThisMonth}</p>
            {subscription.currentPeriodEnd && (
              <p>다음 갱신일: {new Date(subscription.currentPeriodEnd).toLocaleDateString("ko-KR")}</p>
            )}
            {subscription.tier === "premium" && subscription.status === "active" && (
              <Button type="button" variant="outline" size="sm" onClick={cancelSubscription}>
                구독 취소
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-muted-foreground">{error}</p>}

      <section aria-labelledby="plans-heading">
        <h2 id="plans-heading" className="sr-only">
          요금제 옵션
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={cn("flex flex-col", tier.highlight && "border-primary ring-1 ring-primary")}
              aria-label={`${tier.name} 요금제`}
            >
              {tier.highlight && (
                <div className="rounded-t-[calc(var(--radius)-1px)] bg-primary py-1 text-center text-xs font-semibold text-primary-foreground">
                  추천
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-2">
                  <span className="text-3xl font-bold" aria-label={`월 ${tier.price}${tier.period}`}>
                    {tier.price}
                  </span>
                  {tier.period && <span className="ml-1 text-sm text-muted-foreground">{tier.period}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <ul className="space-y-2" aria-label={`${tier.name} 포함 기능`}>
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <span className="shrink-0 text-green-600" aria-hidden="true">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                  {tier.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="shrink-0" aria-hidden="true">
                        –
                      </span>
                      {limitation}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4">
                  <Link
                    href={tier.ctaHref}
                    className={cn(
                      buttonVariants({ variant: tier.highlight ? "default" : "outline" }),
                      "w-full justify-center"
                    )}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      <section aria-labelledby="faq-heading" className="space-y-3">
        <h2 id="faq-heading" className="text-base font-semibold">
          자주 묻는 질문
        </h2>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium">광고가 없나요?</dt>
            <dd className="mt-1 text-muted-foreground">CogFeed는 광고 없이 구독료만으로 운영됩니다.</dd>
          </div>
          <div>
            <dt className="font-medium">구독을 취소하면 어떻게 되나요?</dt>
            <dd className="mt-1 text-muted-foreground">취소 후 상태가 canceled로 바뀌며 만료 전까지 이용할 수 있습니다.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
