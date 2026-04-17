"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings, Sun, Moon, Monitor } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";

import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { PasswordInput } from "@/shared/ui/password-input";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { useLocaleSwitch, type AppLocale } from "@/shared/lib/locale";
import { cn } from "@/shared/lib/utils";

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(1),
}).refine((d) => d.newPassword === d.confirmPassword, { path: ["confirmPassword"] });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const tn = useTranslations("nav");
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const switchLocale = useLocaleSwitch();

  const THEMES = [
    { value: "system", label: tn("themeSystem"), icon: Monitor },
    { value: "light", label: tn("themeLight"), icon: Sun },
    { value: "dark", label: tn("themeDark"), icon: Moon },
  ] as const;

  const LANGS: { value: AppLocale; label: string }[] = [
    { value: "ko", label: tn("langKo") },
    { value: "en", label: tn("langEn") },
  ];

  function savePreference(patch: { theme?: string; locale?: string }) {
    return fetch("/api/v1/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  function handleThemeChange(value: string) {
    setTheme(value);
    void savePreference({ theme: value });
  }

  async function handleLocaleChange(value: AppLocale) {
    await savePreference({ locale: value });
    switchLocale(value);
  }

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  async function onChangePassword(values: PasswordFormValues) {
    setPasswordError(null);
    setPasswordSuccess(false);
    const res = await fetch("/api/v1/auth/me", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: values.currentPassword, newPassword: values.newPassword }),
    });
    if (res.ok) { setPasswordSuccess(true); reset(); }
    else {
      const data = await res.json().catch(() => ({}));
      setPasswordError(data.message ?? t("changeError"));
    }
  }

  async function handleDeleteAccount() {
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/v1/auth/me", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.message ?? t("deleteError"));
        return;
      }
      await signOut({ callbackUrl: "/" });
    } finally {
      setDeleteLoading(false);
    }
  }

  function openDeleteDialog() {
    setDeletePassword("");
    setDeleteError(null);
    setDeleteOpen(true);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Settings size={22} aria-hidden="true" />{t("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("desc")}</p>
      </div>

      <section aria-labelledby="account-info-heading">
        <h2 id="account-info-heading" className="mb-4 text-base font-semibold">{t("accountInfo")}</h2>
        <div className="rounded-md border px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{tc("email")}</span>
          <span className="ml-3">{session?.user?.email ?? "-"}</span>
        </div>
      </section>

      <Separator />

      <section aria-labelledby="change-password-heading">
        <h2 id="change-password-heading" className="mb-4 text-base font-semibold">{t("changePassword")}</h2>
        <form onSubmit={handleSubmit(onChangePassword)} noValidate className="space-y-4">
          {passwordError && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{passwordError}</p>}
          {passwordSuccess && <p role="status" className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{t("changeSuccess")}</p>}

          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
            <PasswordInput id="currentPassword" aria-invalid={!!errors.currentPassword} {...register("currentPassword")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">{t("newPassword")}</Label>
            <PasswordInput id="newPassword" aria-invalid={!!errors.newPassword} {...register("newPassword")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <PasswordInput id="confirmPassword" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
            {errors.confirmPassword && <p role="alert" className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("changing") : t("changeButton")}
          </Button>
        </form>
      </section>

      <Separator />

      <section aria-labelledby="preferences-heading">
        <h2 id="preferences-heading" className="mb-4 text-base font-semibold">{tn("preferences")}</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">{tn("theme")}</p>
            <div className="flex items-center rounded-md border bg-background p-0.5 gap-0.5 w-fit">
              {THEMES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleThemeChange(value)}
                  aria-label={label}
                  aria-pressed={theme === value}
                  className={cn(
                    "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm transition-colors",
                    theme === value
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">{tn("language")}</p>
            <div className="flex items-center rounded-md border bg-background p-0.5 gap-0.5 w-fit">
              {LANGS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleLocaleChange(value)}
                  aria-label={label}
                  aria-pressed={locale === value}
                  className={cn(
                    "rounded px-3 py-1.5 text-sm transition-colors",
                    locale === value
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section aria-labelledby="delete-account-heading">
        <h2 id="delete-account-heading" className="mb-1 text-base font-semibold text-destructive">{t("deleteAccount")}</h2>
        <p className="mb-4 text-sm text-muted-foreground">{t("deleteDesc")}</p>
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogTrigger render={
            <Button type="button" variant="outline" onClick={openDeleteDialog} className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
              {t("deleteButton")}
            </Button>
          } />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>{t("deleteConfirmDesc")}</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="px-6 pb-2 space-y-1.5">
              <Label htmlFor="delete-password">{t("currentPassword")}</Label>
              <PasswordInput
                id="delete-password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !deleteLoading) handleDeleteAccount(); }}
                aria-invalid={!!deleteError}
                autoComplete="current-password"
              />
              {deleteError && <p role="alert" className="text-sm text-destructive">{deleteError}</p>}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteLoading}>{tc("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                disabled={!deletePassword || deleteLoading}
                onClick={(e) => { e.preventDefault(); handleDeleteAccount(); }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteLoading ? t("deleting") : t("deleteAction")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
