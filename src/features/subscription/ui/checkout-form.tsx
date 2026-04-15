"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { checkoutSchema, type CheckoutFormValues } from "@/features/subscription/model/validations";
import { parseApiResponse } from "@/shared/lib/client-api";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function CheckoutForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  async function onSubmit(values: CheckoutFormValues) {
    setServerError(null);

    try {
      const res = await fetch("/api/v1/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      await parseApiResponse(res);

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }

  if (success) {
    return (
      <div
        className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="text-5xl" aria-hidden="true">
          🎉
        </span>
        <h1 className="text-xl font-bold">구독이 시작되었습니다!</h1>
        <p className="text-sm text-muted-foreground">
          이메일로 영수증이 발송됩니다. 잠시 후 대시보드로 이동합니다.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">결제 정보 입력</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          PCI-DSS 기준으로 안전하게 처리됩니다.
        </p>
      </div>

      <Card className="bg-muted/40">
        <CardHeader className="pb-2">
          <CardDescription>주문 내역</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>CogFeed 프리미엄 (월간)</span>
            <span className="font-medium">9,900원</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm font-semibold">
            <span>합계</span>
            <span>9,900원 / 월</span>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="결제 정보 입력 양식">
        {serverError && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {serverError}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cardHolder">카드 소유자 이름</Label>
            <Input
              id="cardHolder"
              type="text"
              autoComplete="cc-name"
              placeholder="홍길동"
              aria-required="true"
              aria-invalid={!!errors.cardHolder}
              aria-describedby={errors.cardHolder ? "cardHolder-error" : undefined}
              {...register("cardHolder")}
            />
            {errors.cardHolder && (
              <p id="cardHolder-error" role="alert" className="text-sm text-destructive">
                {errors.cardHolder.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cardNumber">카드 번호</Label>
            <Input
              id="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              aria-required="true"
              aria-invalid={!!errors.cardNumber}
              aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
              {...register("cardNumber")}
              onChange={(e) => setValue("cardNumber", formatCardNumber(e.target.value))}
            />
            {errors.cardNumber && (
              <p id="cardNumber-error" role="alert" className="text-sm text-destructive">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="expiry">만료일</Label>
              <Input
                id="expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                aria-required="true"
                aria-invalid={!!errors.expiry}
                aria-describedby={errors.expiry ? "expiry-error" : undefined}
                {...register("expiry")}
                onChange={(e) => setValue("expiry", formatExpiry(e.target.value))}
              />
              {errors.expiry && (
                <p id="expiry-error" role="alert" className="text-sm text-destructive">
                  {errors.expiry.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                maxLength={4}
                aria-required="true"
                aria-invalid={!!errors.cvc}
                aria-describedby={errors.cvc ? "cvc-error" : undefined}
                {...register("cvc")}
              />
              {errors.cvc && (
                <p id="cvc-error" role="alert" className="text-sm text-destructive">
                  {errors.cvc.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link
            href="/settings/subscription"
            className={cn(buttonVariants({ variant: "outline" }), "flex-1 justify-center sm:flex-none")}
            aria-label="구독 옵션 선택으로 돌아가기"
          >
            이전
          </Link>
          <Button
            type="submit"
            size="lg"
            className="flex-1 sm:flex-none"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "결제 처리 중..." : "결제하기"}
          >
            {isSubmitting ? "처리 중..." : "결제하기 · 9,900원"}
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          결제 완료 후 이메일 영수증이 발송됩니다. 언제든지 설정에서 구독을 취소할 수 있습니다.
        </p>
      </form>
    </div>
  );
}
