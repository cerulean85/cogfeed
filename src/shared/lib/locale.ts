"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export type AppLocale = "ko" | "en";

export function useLocaleSwitch() {
  const router = useRouter();

  const switchLocale = useCallback((locale: AppLocale) => {
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  }, [router]);

  return switchLocale;
}
