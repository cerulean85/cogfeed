"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해 주세요."),
  newPassword: z.string().min(8, "새 비밀번호는 8자 이상이어야 합니다."),
  confirmPassword: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "새 비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  async function onChangePassword(values: PasswordFormValues) {
    setPasswordError(null);
    setPasswordSuccess(false);

    const res = await fetch("/api/v1/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    });

    if (res.ok) {
      setPasswordSuccess(true);
      reset();
    } else {
      const data = await res.json().catch(() => ({}));
      setPasswordError(
        data.message ?? "비밀번호 변경에 실패했습니다. 다시 시도해 주세요."
      );
    }
  }

  async function handleDeleteAccount() {
    await fetch("/api/v1/auth/me", { method: "DELETE" });
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Settings size={22} aria-hidden="true" />
          계정 설정
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">계정 정보를 관리합니다.</p>
      </div>

      {/* 계정 정보 */}
      <section aria-labelledby="account-info-heading">
        <h2 id="account-info-heading" className="mb-4 text-base font-semibold">계정 정보</h2>
        <div className="rounded-md border px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">이메일</span>
          <span className="ml-3">{session?.user?.email ?? "-"}</span>
        </div>
      </section>

      <Separator />

      {/* 비밀번호 변경 */}
      <section aria-labelledby="change-password-heading">
        <h2 id="change-password-heading" className="mb-4 text-base font-semibold">비밀번호 변경</h2>
        <form onSubmit={handleSubmit(onChangePassword)} noValidate className="space-y-4">
          {passwordError && (
            <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {passwordError}
            </p>
          )}
          {passwordSuccess && (
            <p role="status" className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              비밀번호가 변경되었습니다.
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">현재 비밀번호</Label>
            <Input id="currentPassword" type="password" aria-invalid={!!errors.currentPassword} {...register("currentPassword")} />
            {errors.currentPassword && <p role="alert" className="text-sm text-destructive">{errors.currentPassword.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">새 비밀번호</Label>
            <Input id="newPassword" type="password" aria-invalid={!!errors.newPassword} {...register("newPassword")} />
            {errors.newPassword && <p role="alert" className="text-sm text-destructive">{errors.newPassword.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
            <Input id="confirmPassword" type="password" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
            {errors.confirmPassword && <p role="alert" className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} aria-label={isSubmitting ? "변경 중..." : "비밀번호 변경"}>
            {isSubmitting ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </form>
      </section>

      <Separator />

      {/* 회원 탈퇴 */}
      <section aria-labelledby="delete-account-heading">
        <h2 id="delete-account-heading" className="mb-1 text-base font-semibold text-destructive">회원 탈퇴</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          탈퇴 시 모든 기록과 분석 데이터가 즉시 삭제되며 복구할 수 없습니다.
        </p>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button type="button" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label="회원 탈퇴">
                회원 탈퇴
              </Button>
            }
          />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>정말 탈퇴하시겠어요?</AlertDialogTitle>
              <AlertDialogDescription>
                모든 기록과 분석 데이터가 즉시 삭제되며 복구할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                탈퇴
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
