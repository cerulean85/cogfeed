"use client";

import { useLocale } from "next-intl";
import { cn } from "@/shared/lib/utils";
import { useLocaleSwitch, type AppLocale } from "@/shared/lib/locale";

const LANGS: { value: AppLocale; label: string }[] = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "EN" },
];

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const switchLocale = useLocaleSwitch();

  return (
    <div className={cn("flex items-center rounded-md border bg-background p-0.5 gap-0.5", className)}>
      {LANGS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => switchLocale(value)}
          aria-label={label}
          aria-pressed={locale === value}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            locale === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
