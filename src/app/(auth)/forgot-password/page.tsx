"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";

const schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("auth");
  const tc = useTranslations("common");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const res = await fetch("/api/v1/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) {
        const data = await res.json();
        setServerError(data.error ?? t("networkError"));
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError(t("networkError"));
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{t("forgotTitle")}</CardTitle>
        <CardDescription>{t("forgotDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{t("forgotSent")}</p>
            <Link href="/login" className="text-sm underline underline-offset-4 hover:text-foreground">{t("backToLogin")}</Link>
          </div>
        ) : (
          <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {serverError && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</div>}
            <div className="space-y-1.5">
              <Label htmlFor="email">{tc("email")}</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="example@email.com" aria-required="true" aria-describedby={errors.email ? "email-error" : undefined} aria-invalid={!!errors.email} {...register("email")} />
              {errors.email && <p id="email-error" role="alert" className="text-sm text-destructive">{t("emailError" as never)}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? tc("sending") : t("forgotButton")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="underline underline-offset-4 hover:text-foreground">{t("backToLogin")}</Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
