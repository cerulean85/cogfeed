"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { loginSchema, type LoginFormValues } from "@/features/auth/model/validations";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "@/shared/ui/password-input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const t = useTranslations("auth");
  const tc = useTranslations("common");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        setServerError(t("loginError"));
        return;
      }
      router.push(result?.url ?? callbackUrl);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : t("networkError"));
    }
  }

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate aria-label="로그인 양식" className="space-y-5">
      {serverError && (
        <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">{tc("email")}</Label>
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
        {errors.email && <p id="email-error" role="alert" className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">{tc("password")}</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="비밀번호 입력"
          aria-required="true"
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && <p id="password-error" role="alert" className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting} aria-label={isSubmitting ? tc("processing") : t("loginButton")}>
        {isSubmitting ? tc("processing") : t("loginButton")}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/forgot-password" className="underline underline-offset-4 hover:text-foreground">
          {t("forgotPassword")}
        </Link>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link
          href={callbackUrl !== "/dashboard" ? `/register/terms?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/register/terms"}
          className="underline underline-offset-4 hover:text-foreground"
        >
          {t("signUpLink")}
        </Link>
      </p>
    </form>
  );
}
