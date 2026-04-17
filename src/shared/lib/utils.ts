import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// callbackUrl이 내부 경로인지 검증 — 외부 URL 리다이렉트 방지
export function safeCallbackUrl(url: string | null | undefined, fallback = "/dashboard"): string {
  if (!url) return fallback;
  // 반드시 /로 시작하고 //로 시작하지 않아야 함 (protocol-relative URL 차단)
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  return fallback;
}
