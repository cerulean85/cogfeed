import { MobileNav, Sidebar } from "@/widgets/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* 사이드바 — 데스크톱 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <main
        className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-20 md:pb-8 max-w-4xl"
        id="main-content"
      >
        {children}
      </main>

      {/* 하단 탭 — 모바일 브라우저 */}
      <MobileNav />
    </div>
  );
}
