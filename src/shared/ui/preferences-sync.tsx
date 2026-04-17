"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const SESSION_KEY = "prefs_synced";

export function PreferencesSync({ theme: dbTheme, locale: dbLocale }: { theme: string; locale: string }) {
  const { setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    setTheme(dbTheme);

    const cookieLocale = document.cookie.match(/(?:^|; )locale=([^;]*)/)?.[1];
    if (cookieLocale !== dbLocale) {
      document.cookie = `locale=${dbLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      router.refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
