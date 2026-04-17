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
        className="flex flex-1 justify-center px-4 py-6 pb-20 md:px-8 md:py-8 md:pb-8"
        id="main-content"
      >
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* 하단 탭 — 모바일 브라우저 */}
      <MobileNav />
    </div>
  );
}
