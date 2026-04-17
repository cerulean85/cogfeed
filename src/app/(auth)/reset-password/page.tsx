"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { PasswordInput } from "@/shared/ui/password-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

const schema = z.object({
  password: z.string().min(8),
  passwordConfirm: z.string(),
}).refine((d) => d.password === d.passwordConfirm, { path: ["passwordConfirm"] });
type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const t = useTranslations("auth");
  const tc = useTranslations("common");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-4">
          <p className="text-sm text-destructive">{t("invalidLink")}</p>
          <Link href="/forgot-password" className="text-sm underline underline-offset-4 hover:text-foreground">{t("getNewLink")}</Link>
        </CardContent>
      </Card>
    );
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const res = await fetch("/api/v1/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: values.password }) });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error ?? t("networkError")); return; }
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setServerError(t("networkError"));
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{t("resetTitle")}</CardTitle>
        <CardDescription>{t("resetDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        {done ? (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{t("resetDone")}</p>
          </div>
        ) : (
          <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {serverError && (
              <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
                {serverError.includes("만료") && <span>{" "}<Link href="/forgot-password" className="font-medium underline">{t("getNewLink")}</Link></span>}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="password">{t("newPassword")}</Label>
              <PasswordInput id="password" autoComplete="new-password" placeholder={t("newPasswordPlaceholder")} aria-required="true" aria-describedby={errors.password ? "password-error" : undefined} aria-invalid={!!errors.password} {...register("password")} />
              {errors.password && <p id="password-error" role="alert" className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="passwordConfirm">{t("confirmNewPassword")}</Label>
              <PasswordInput id="passwordConfirm" autoComplete="new-password" placeholder={t("passwordConfirmPlaceholder")} aria-required="true" aria-describedby={errors.passwordConfirm ? "confirm-error" : undefined} aria-invalid={!!errors.passwordConfirm} {...register("passwordConfirm")} />
              {errors.passwordConfirm && <p id="confirm-error" role="alert" className="text-sm text-destructive">{errors.passwordConfirm.message}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? t("resetChanging") : t("resetButton")}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
