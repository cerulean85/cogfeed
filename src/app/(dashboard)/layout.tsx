import type { Metadata } from "next";
import { MobileNav, Sidebar } from "@/widgets/navigation";
import { Footer } from "@/shared/ui/footer";
import { PreferencesSync } from "@/shared/ui/preferences-sync";
import { getCurrentUser } from "@/shared/lib/auth";
import { getSiteConfig } from "@/shared/lib/site-config";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, coupangSrc] = await Promise.all([
    getCurrentUser(),
    getSiteConfig("coupang_iframe_src_1"),
  ]);
  const dbTheme = (user as { theme?: string } | null)?.theme ?? "system";
  const dbLocale = (user as { locale?: string } | null)?.locale ?? "ko";
  const safeCoupangSrc = coupangSrc ?? "https://coupa.ng/cmr66l";

  return (
    <div className="flex min-h-screen">
      <PreferencesSync theme={dbTheme} locale={dbLocale} />
      {/* 사이드바 — 데스크톱 */}
      <Sidebar coupangSrc={safeCoupangSrc} />

      {/* 메인 콘텐츠 */}
      <main
        className="flex flex-1 flex-col justify-between px-4 py-6 pb-[calc(5rem+env(safe-area-inset-bottom))] md:px-8 md:py-8 md:pb-8"
        id="main-content"
      >
<div className="w-full">
          {children}
        </div>
        <Footer className="mt-12" />
      </main>

      {/* 하단 탭 — 모바일 브라우저 */}
      <MobileNav />
    </div>
  );
}
