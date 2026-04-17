"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { recordSchema, type RecordFormValues } from "@/features/record/model/validations";
import { parseApiResponse } from "@/shared/lib/client-api";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";

const MAX_CHARS = 500;

export function CreateRecordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: { content: "" },
  });

  const content = useWatch({ name: "content", control });
  const displayCount = content?.length ?? 0;

  async function onSubmit(values: RecordFormValues) {
    setServerError(null);

    if (!navigator.onLine) {
      setServerError("오프라인 상태입니다. 네트워크 연결을 확인해 주세요.");
      return;
    }

    try {
      const res = await fetch("/api/v1/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: values.content, analyzeNow: true }),
      });
      const data = await parseApiResponse<{ recordId: string }>(res);

      router.push(`/feedback/${data.recordId}`);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "저장에 실패했습니다. 다시 시도해 주세요.");
    }
  }

  function handleCancel() {
    if (displayCount > 0) {
      setShowCancelDialog(true);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <>
      {showCancelDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="mx-4 w-full max-w-sm space-y-4 rounded-lg border bg-background p-6 shadow-lg">
            <h2 id="cancel-dialog-title" className="text-lg font-semibold">
              기록을 취소할까요?
            </h2>
            <p className="text-sm text-muted-foreground">
              작성 중인 내용이 저장되지 않습니다.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                aria-label="계속 작성하기"
              >
                계속 작성
              </Button>
              <Button
                variant="destructive"
                onClick={() => router.push("/dashboard")}
                aria-label="취소하고 대시보드로 이동"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">기록 작성</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            생각, 분석 메모, 글의 초안을 자유롭게 입력하세요.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="기록 입력 양식">
          {serverError && (
            <div
              role="alert"
              className="mb-4 flex items-center justify-between gap-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <span>{serverError}</span>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                aria-label="다시 저장 시도"
              >
                재시도
              </Button>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="content">
              기록 내용
              <span className="ml-1 text-destructive" aria-hidden="true">
                *
              </span>
            </Label>
            <textarea
              id="content"
              rows={10}
              placeholder="여기에 생각을 자유롭게 기록해 보세요. (최소 20자)"
              aria-label="기록 입력"
              aria-required="true"
              aria-describedby={errors.content ? "content-error" : "content-hint"}
              aria-invalid={!!errors.content}
              maxLength={MAX_CHARS}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              {...register("content")}
            />

            <div className="flex items-center justify-between">
              {errors.content ? (
                <p id="content-error" role="alert" className="text-sm text-destructive">
                  {errors.content.message}
                </p>
              ) : (
                <p id="content-hint" className="text-xs text-muted-foreground">
                  {displayCount < 20
                    ? `${20 - displayCount}자 더 입력해 주세요.`
                    : "저장 가능합니다."}
                </p>
              )}
              <p
                className={`text-xs tabular-nums ${
                  displayCount >= MAX_CHARS ? "text-destructive" : "text-muted-foreground"
                }`}
                aria-live="polite"
                aria-label={`${displayCount}자 / 최대 ${MAX_CHARS}자`}
              >
                {displayCount} / {MAX_CHARS}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
              aria-label="기록 작성 취소"
              className="flex-1 sm:flex-none"
            >
              취소
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || displayCount === 0}
              aria-label={isSubmitting ? "저장 중..." : "기록 저장"}
              className="flex-1 sm:flex-none"
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
