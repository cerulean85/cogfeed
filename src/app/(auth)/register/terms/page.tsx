"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const TERMS_ITEMS = [
  {
    id: "terms-service",
    label: "[필수] 서비스 이용약관에 동의합니다.",
    required: true,
    href: "/terms/service",
  },
  {
    id: "terms-privacy",
    label: "[필수] 개인정보 수집 및 이용에 동의합니다.",
    required: true,
    href: "/terms/privacy",
  },
  {
    id: "terms-marketing",
    label: "[선택] 마케팅 정보 수신에 동의합니다.",
    required: false,
    href: null,
  },
] as const;

export default function TermsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checked, setChecked] = useState<Record<string, boolean>>({
    "terms-service": false,
    "terms-privacy": false,
    "terms-marketing": false,
  });
  const [touched, setTouched] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl");

  const allRequired = TERMS_ITEMS.filter((t) => t.required).every(
    (t) => checked[t.id]
  );
  const allChecked = TERMS_ITEMS.every((t) => checked[t.id]);

  function toggleAll(value: boolean) {
    const next: Record<string, boolean> = {};
    TERMS_ITEMS.forEach((t) => { next[t.id] = value; });
    setChecked(next);
  }

  function handleContinue() {
    setTouched(true);
    if (!allRequired) return;
    const marketing = checked["terms-marketing"] ? "1" : "0";
    const base = callbackUrl
      ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}&marketing=${marketing}`
      : `/register?marketing=${marketing}`;
    router.push(base);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">이용약관 동의</CardTitle>
        <CardDescription>
          서비스 이용을 위해 아래 약관에 동의해 주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 전체 동의 */}
        <div className="flex items-center gap-3 rounded-md border p-4">
          <Checkbox
            id="terms-all"
            checked={allChecked}
            onCheckedChange={(v) => toggleAll(!!v)}
            aria-label="전체 약관에 동의합니다."
          />
          <Label htmlFor="terms-all" className="font-semibold cursor-pointer">
            전체 동의
          </Label>
        </div>

        <Separator />

        {/* 개별 항목 */}
        <ul className="space-y-4" aria-label="약관 목록">
          {TERMS_ITEMS.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <Checkbox
                id={item.id}
                checked={checked[item.id]}
                onCheckedChange={(v) =>
                  setChecked((prev) => ({ ...prev, [item.id]: !!v }))
                }
                aria-required={item.required}
                aria-label={item.label}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label htmlFor={item.id} className="cursor-pointer leading-snug">
                  {item.label}
                </Label>
                {item.href && (
                  <div>
                    <Link
                      href={item.href}
                      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                    >
                      내용 보기
                    </Link>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* 필수 항목 미동의 오류 */}
        {touched && !allRequired && (
          <p role="alert" className="text-sm text-destructive">
            필수 항목에 모두 동의해 주세요.
          </p>
        )}

        {/* 다음 버튼 */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleContinue}
          aria-label="다음 단계로 이동"
        >
          다음
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link
            href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
            className="underline underline-offset-4 hover:text-foreground"
          >
            로그인
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
