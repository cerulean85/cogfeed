"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

type FormValues = { name: string; email: string; message: string };

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("contact");
  const tc = useTranslations("common");

  const schema = z.object({
    name: z.string().min(1, t("nameError")).max(50),
    email: z.string().email(t("emailError")),
    message: z.string().min(10, t("messageMinError")).max(1000, t("messageMaxError")),
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const messageLength = watch("message")?.length ?? 0;

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const res = await fetch("/api/v1/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setServerError(data.error ?? t("sendError"));
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 text-center py-20">
        <div className="flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Mail size={28} aria-hidden="true" />
          </span>
        </div>
        <h1 className="text-2xl font-bold">{t("successTitle")}</h1>
        <p className="text-muted-foreground">{t("successDesc")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Mail size={22} aria-hidden="true" />{t("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("desc")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label={t("title")} className="space-y-5">
        {serverError && <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</div>}

        <div className="space-y-1.5">
          <Label htmlFor="name">{t("name")} <span className="text-destructive" aria-hidden="true">*</span></Label>
          <Input id="name" placeholder={t("namePlaceholder")} aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
          {errors.name && <p id="name-error" role="alert" className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{tc("email")} <span className="text-destructive" aria-hidden="true">*</span></Label>
          <Input id="email" type="email" placeholder="example@email.com" aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} />
          {errors.email && <p id="email-error" role="alert" className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message">{t("message")} <span className="text-destructive" aria-hidden="true">*</span></Label>
          <textarea id="message" rows={8} placeholder={t("messagePlaceholder")} aria-required="true" aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : "message-hint"} maxLength={1000}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("message")} />
          <div className="flex items-center justify-between">
            {errors.message ? (
              <p id="message-error" role="alert" className="text-sm text-destructive">{errors.message.message}</p>
            ) : (
              <p id="message-hint" className="text-xs text-muted-foreground">
                {messageLength < 10 ? t("needMore", { count: 10 - messageLength }) : t("readyToSend")}
              </p>
            )}
            <p className="text-xs tabular-nums text-muted-foreground" aria-live="polite">{messageLength} / 1000</p>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? tc("sending") : t("submitButton")}
        </Button>
      </form>
    </div>
  );
}
