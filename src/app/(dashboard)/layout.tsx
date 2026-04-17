import { MobileNav, Sidebar } from "@/widgets/navigation";
import { Footer } from "@/shared/ui/footer";
import { PreferencesSync } from "@/shared/ui/preferences-sync";
import { getCurrentUser } from "@/shared/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const dbTheme = user?.theme ?? "system";
  const dbLocale = user?.locale ?? "ko";

  return (
    <div className="flex min-h-screen">
      <PreferencesSync theme={dbTheme} locale={dbLocale} />
      {/* 사이드바 — 데스크톱 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <main
        className="flex flex-1 flex-col justify-between px-4 py-6 pb-20 md:px-8 md:py-8 md:pb-8"
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
