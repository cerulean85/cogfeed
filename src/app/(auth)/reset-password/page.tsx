"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "@/shared/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const schema = z
  .object({
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirm: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });
type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          <p className="text-sm text-destructive">유효하지 않은 링크입니다.</p>
          <Link href="/forgot-password" className="text-sm underline underline-offset-4 hover:text-foreground">
            재설정 링크 다시 받기
          </Link>
        </CardContent>
      </Card>
    );
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const res = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "오류가 발생했습니다.");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setServerError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">새 비밀번호 설정</CardTitle>
        <CardDescription>새로 사용할 비밀번호를 입력해 주세요.</CardDescription>
      </CardHeader>
      <CardContent>
        {done ? (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              비밀번호가 변경되었습니다. 잠시 후 로그인 페이지로 이동합니다.
            </p>
          </div>
        ) : (
          <form
            method="post"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
            aria-label="새 비밀번호 설정 양식"
          >
            {serverError && (
              <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
                {serverError.includes("만료") && (
                  <span>
                    {" "}
                    <Link href="/forgot-password" className="font-medium underline">
                      재설정 링크 다시 받기
                    </Link>
                  </span>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="password">새 비밀번호</Label>
              <PasswordInput
                id="password"
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
              <Label htmlFor="passwordConfirm">새 비밀번호 확인</Label>
              <PasswordInput
                id="passwordConfirm"
                autoComplete="new-password"
                placeholder="비밀번호를 다시 입력"
                aria-required="true"
                aria-describedby={errors.passwordConfirm ? "confirm-error" : undefined}
                aria-invalid={!!errors.passwordConfirm}
                {...register("passwordConfirm")}
              />
              {errors.passwordConfirm && (
                <p id="confirm-error" role="alert" className="text-sm text-destructive">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "변경 중..." : "비밀번호 변경"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
