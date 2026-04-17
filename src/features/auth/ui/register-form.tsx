"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { registerSchema, type RegisterFormValues } from "@/features/auth/model/validations";
import { parseApiResponse } from "@/shared/lib/client-api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const callbackUrl = searchParams.get("callbackUrl");
  const marketingConsent = searchParams.get("marketing") === "1";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          passwordConfirm: values.passwordConfirm,
          agreedToTerms: true,
          marketingConsent,
        }),
      });
      await parseApiResponse(res);

      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      router.push(
        callbackUrl ? `/onboarding?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/onboarding"
      );
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="회원가입 양식"
      className="space-y-5"
    >
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {serverError}
          {serverError.includes("이미 사용 중인") && (
            <span>
              {" "}
              <Link href="/login" className="font-medium underline">
                비밀번호 찾기
              </Link>
            </span>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="example@email.com"
          aria-required="true"
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="8자 이상 입력"
          aria-required="true"
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" role="alert" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
        <Input
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="비밀번호를 다시 입력"
          aria-required="true"
          aria-describedby={errors.passwordConfirm ? "passwordConfirm-error" : undefined}
          aria-invalid={!!errors.passwordConfirm}
          {...register("passwordConfirm")}
        />
        {errors.passwordConfirm && (
          <p id="passwordConfirm-error" role="alert" className="text-sm text-destructive">
            {errors.passwordConfirm.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
        aria-label={isSubmitting ? "가입 처리 중..." : "가입하기"}
      >
        {isSubmitting ? "처리 중..." : "가입하기"}
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
    </form>
  );
}
