"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { Separator } from "@/shared/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody } from "@/shared/ui/dialog";
import { TermsServiceKo, TermsServiceEn, PrivacyKo, PrivacyEn } from "@/shared/ui/terms-content";

export default function TermsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const [checked, setChecked] = useState({ "terms-service": false, "terms-privacy": false, "terms-marketing": false });
  const [touched, setTouched] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl");
  const locale = useLocale();

  const TERMS_ITEMS = [
    {
      id: "terms-service" as const, label: t("termService"), required: true,
      content: locale === "en" ? <TermsServiceEn /> : <TermsServiceKo />,
      title: locale === "en" ? "Terms of Service" : "서비스 이용약관",
    },
    {
      id: "terms-privacy" as const, label: t("termPrivacy"), required: true,
      content: locale === "en" ? <PrivacyEn /> : <PrivacyKo />,
      title: locale === "en" ? "Privacy Policy" : "개인정보처리방침",
    },
    {
      id: "terms-marketing" as const, label: t("termMarketing"), required: false,
      content: null, title: null,
    },
  ];

  const allRequired = TERMS_ITEMS.filter((t) => t.required).every((t) => checked[t.id]);
  const allChecked = TERMS_ITEMS.every((t) => checked[t.id]);

  function toggleAll(value: boolean) {
    setChecked({ "terms-service": value, "terms-privacy": value, "terms-marketing": value });
  }

  function handleContinue() {
    setTouched(true);
    if (!allRequired) return;
    const marketing = checked["terms-marketing"] ? "1" : "0";
    const base = callbackUrl
      ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}&marketing=${marketing}`
      : `/register?marketing=${marketing}`;
    router.push(base);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{t("termsTitle")}</CardTitle>
        <CardDescription>{t("termsDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-3 rounded-md border p-4">
          <Checkbox id="terms-all" checked={allChecked} onCheckedChange={(v) => toggleAll(!!v)} aria-label={t("agreeAll")} />
          <Label htmlFor="terms-all" className="font-semibold cursor-pointer">{t("agreeAll")}</Label>
        </div>

        <Separator />

        <ul className="space-y-4" aria-label="약관 목록">
          {TERMS_ITEMS.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <Checkbox
                id={item.id}
                checked={checked[item.id]}
                onCheckedChange={(v) => setChecked((prev) => ({ ...prev, [item.id]: !!v }))}
                aria-required={item.required}
                aria-label={item.label}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label htmlFor={item.id} className="cursor-pointer leading-snug">{item.label}</Label>
                {item.content && (
                  <Dialog>
                    <DialogTrigger className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
                      {tc("viewContent")}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{item.title}</DialogTitle>
                        <DialogClose aria-label="닫기"><X size={16} /></DialogClose>
                      </DialogHeader>
                      <DialogBody>{item.content}</DialogBody>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </li>
          ))}
        </ul>

        {touched && !allRequired && (
          <p role="alert" className="text-sm text-destructive">{t("termsRequired")}</p>
        )}

        <Button className="w-full" size="lg" onClick={handleContinue}>{tc("next")}</Button>

        <p className="text-center text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"} className="underline underline-offset-4 hover:text-foreground">
            {t("loginLink")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
