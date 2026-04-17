"use client";

import { X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody } from "@/shared/ui/dialog";
import { TermsServiceKo, TermsServiceEn, PrivacyKo, PrivacyEn } from "@/shared/ui/terms-content";

export function Footer({ className }: { className?: string }) {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className={className}>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <Dialog>
          <DialogTrigger className="underline underline-offset-4 hover:text-foreground">
            {t("terms")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("terms")}</DialogTitle>
              <DialogClose aria-label="닫기"><X size={16} /></DialogClose>
            </DialogHeader>
            <DialogBody>
              {locale === "en" ? <TermsServiceEn /> : <TermsServiceKo />}
            </DialogBody>
          </DialogContent>
        </Dialog>

        <span aria-hidden="true">·</span>

        <Dialog>
          <DialogTrigger className="underline underline-offset-4 hover:text-foreground">
            {t("privacy")}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("privacy")}</DialogTitle>
              <DialogClose aria-label="닫기"><X size={16} /></DialogClose>
            </DialogHeader>
            <DialogBody>
              {locale === "en" ? <PrivacyEn /> : <PrivacyKo />}
            </DialogBody>
          </DialogContent>
        </Dialog>

        <span aria-hidden="true">·</span>
        <span>{t("copyright")}</span>
      </div>
    </footer>
  );
}
