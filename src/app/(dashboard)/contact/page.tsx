"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

const schema = z.object({
  name: z.string().min(1, "이름을 입력해 주세요.").max(50),
  email: z.string().email("올바른 이메일을 입력해 주세요."),
  message: z.string().min(10, "10자 이상 입력해 주세요.").max(1000, "1000자 이하로 입력해 주세요."),
});

type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const messageLength = watch("message")?.length ?? 0;

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const res = await fetch("/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setServerError(data.error ?? "메일 발송에 실패했습니다. 다시 시도해 주세요.");
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
        <h1 className="text-2xl font-bold">문의가 접수되었습니다</h1>
        <p className="text-muted-foreground">빠른 시일 내에 답변 드리겠습니다.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Mail size={22} aria-hidden="true" />
          문의하기
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          서비스 관련 문의사항을 남겨주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="문의 양식" className="space-y-5">
        {serverError && (
          <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name">
            이름 <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Input
            id="name"
            placeholder="홍길동"
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">
            이메일 <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="message">
            문의 내용 <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <textarea
            id="message"
            rows={8}
            placeholder="문의하실 내용을 입력해 주세요. (최소 10자)"
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : "message-hint"}
            maxLength={1000}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...register("message")}
          />
          <div className="flex items-center justify-between">
            {errors.message ? (
              <p id="message-error" role="alert" className="text-sm text-destructive">{errors.message.message}</p>
            ) : (
              <p id="message-hint" className="text-xs text-muted-foreground">
                {messageLength < 10 ? `${10 - messageLength}자 더 입력해 주세요.` : "전송 가능합니다."}
              </p>
            )}
            <p className="text-xs tabular-nums text-muted-foreground" aria-live="polite">
              {messageLength} / 1000
            </p>
          </div>
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto" aria-label={isSubmitting ? "전송 중..." : "문의 전송"}>
          {isSubmitting ? "전송 중..." : "문의 전송"}
        </Button>
      </form>
    </div>
  );
}
