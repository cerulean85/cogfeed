"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Home, BookOpen, Sparkles, LogOut, Brain, Mail, Settings } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
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

export function Sidebar({ coupangSrc }: { coupangSrc: string }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const email = session?.user?.email ?? "";
  const initial = email.charAt(0).toUpperCase();

  const MAIN_ITEMS = [
    { href: "/dashboard", label: t("home"), icon: Home },
    { href: "/records", label: t("records"), icon: BookOpen },
    { href: "/feedback", label: t("feedback"), icon: Sparkles },
  ] as const;

  const SUB_ITEMS = [
    { href: "/settings", label: t("settings"), icon: Settings },
    { href: "/contact", label: t("contact"), icon: Mail },
  ] as const;

  function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
    const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
    return (
      <Link
        href={href}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/60"
        )}
      >
        <Icon size={18} aria-hidden="true" />
        {label}
      </Link>
    );
  }

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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground"
          aria-hidden="true"
        >
          {initial}
        </div>
        <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={email}>
          {email}
        </span>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                aria-label={t("logout")}
              >
                <LogOut size={14} aria-hidden="true" />
              </Button>
            }
          />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>{t("logoutConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>{t("logoutConfirmDesc")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{tc("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={() => signOut({ callbackUrl: "/login" })}>
                {t("logout")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* 주요 메뉴 */}
      {MAIN_ITEMS.map((item) => <NavLink key={item.href} {...item} />)}

      {/* 부가 메뉴 */}
      <div className="mt-auto border-t pt-2">
        {SUB_ITEMS.map((item) => <NavLink key={item.href} {...item} />)}
      </div>

      {/* 쿠팡 파트너스 배너 */}
      <div className="px-3 pt-2">
        <div className="w-full overflow-hidden rounded-md border bg-white shadow-sm">
          <iframe
            src={coupangSrc}
            width="200"
            height="240"
            referrerPolicy="unsafe-url"
            style={{ display: "block", width: "100%", border: 0, overflow: "hidden" }}
          />
        </div>
      </div>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const MAIN_ITEMS = [
    { href: "/dashboard", label: t("home"), icon: Home },
    { href: "/records", label: t("records"), icon: BookOpen },
    { href: "/feedback", label: t("feedback"), icon: Sparkles },
  ] as const;

  const SUB_ITEMS = [
    { href: "/settings", label: t("settings"), icon: Settings },
    { href: "/contact", label: t("contact"), icon: Mail },
  ] as const;

  function MobileNavLink({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
    const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
    return (
      <Link
        href={href}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Icon size={20} aria-hidden="true" />
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <nav
      aria-label="모바일 하단 메뉴"
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-background md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      {MAIN_ITEMS.map((item) => <MobileNavLink key={item.href} {...item} />)}
      <div className="w-px self-stretch bg-border my-2" aria-hidden="true" />
      {SUB_ITEMS.map((item) => <MobileNavLink key={item.href} {...item} />)}
    </nav>
  );
}
