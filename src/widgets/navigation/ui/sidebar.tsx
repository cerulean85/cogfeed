"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "홈", icon: "🏠" },
  { href: "/records", label: "기록 관리", icon: "📝" },
  { href: "/feedback", label: "피드백", icon: "💬" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="hidden min-h-screen w-56 shrink-0 flex-col gap-1 border-r bg-sidebar px-3 py-6 md:flex"
    >
      <Link
        href="/dashboard"
        className="mb-6 px-3 text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
        aria-label="CogFeed 대시보드 홈"
      >
        CogFeed
      </Link>

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
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}

      <div className="mt-auto flex flex-col items-center gap-4 px-3 pt-6">
        {/* 쿠팡 파트너스 배너 */}
        <div className="overflow-hidden rounded-md border bg-white shadow-sm">
          <iframe
            src="https://coupa.ng/cmpW0U"
            width="120"
            height="240"
            frameBorder="0"
            scrolling="no"
            referrerPolicy="unsafe-url"
          ></iframe>
        </div>

        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          로그아웃
        </Button>
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
            <span className="text-xl" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
