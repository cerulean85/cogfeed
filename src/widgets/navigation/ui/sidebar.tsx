"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Home, BookOpen, Sparkles, LogOut, Brain, Sun, Moon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "홈", icon: Home },
  { href: "/records", label: "기록 관리", icon: BookOpen },
  { href: "/feedback", label: "피드백", icon: Sparkles },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const email = session?.user?.email ?? "";
  const initial = email.charAt(0).toUpperCase();

  return (
    <nav
      aria-label="주요 메뉴"
      className="hidden h-screen w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r bg-sidebar px-3 py-6 md:sticky md:top-0 md:flex"
    >
      {/* 로고 */}
      <Link
        href="/dashboard"
        className="mb-4 flex items-center gap-2 px-3 text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
        aria-label="CogFeed 대시보드 홈"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-500">
          <Brain size={16} aria-hidden="true" />
        </span>
        CogFeed
      </Link>

      {/* 사용자 정보 + 로그아웃 */}
      <div className="mb-4 flex items-center gap-2 rounded-md border bg-background px-3 py-2">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          aria-hidden="true"
        >
          {initial}
        </div>
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={email}>
          {email}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={() => signOut({ callbackUrl: "/login" })}
          aria-label="로그아웃"
        >
          <LogOut size={14} aria-hidden="true" />
        </Button>
      </div>

      {/* 네비게이션 */}
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60"
            )}
          >
            <item.icon size={18} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}

      {/* 다크모드 토글 */}
      <div className="mt-auto px-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
        >
          {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          <span className="text-sm">{theme === "dark" ? "라이트 모드" : "다크 모드"}</span>
        </Button>
      </div>

      {/* 쿠팡 파트너스 배너 */}
      <div className="px-3 pt-2">
        <div className="w-full overflow-hidden rounded-md border bg-white shadow-sm">
          <iframe
            src="https://coupa.ng/cmpW0U"
            width="200"
            height="240"
            frameBorder="0"
            scrolling="no"
            referrerPolicy="unsafe-url"
            style={{ display: "block", width: "100%" }}
          />
        </div>
      </div>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="모바일 하단 메뉴"
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-background md:hidden"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
