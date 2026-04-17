import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "서비스 이용약관 — CogFeed",
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-foreground">
      <div className="mb-8 space-y-1">
        <p className="text-xs text-muted-foreground">시행일: 2026년 4월 17일</p>
        <h1 className="text-2xl font-bold tracking-tight">서비스 이용약관</h1>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-2 font-semibold text-base">제1조 (목적)</h2>
          <p className="text-muted-foreground">
            이 약관은 CogFeed(이하 "서비스")가 제공하는 인지 오류 피드백 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제2조 (정의)</h2>
          <ul className="space-y-1 text-muted-foreground list-disc pl-5">
            <li>"서비스"란 CogFeed가 제공하는 AI 기반 인지 오류 분석 및 피드백 웹 서비스를 말합니다.</li>
            <li>"이용자"란 이 약관에 동의하고 서비스를 이용하는 모든 회원을 말합니다.</li>
            <li>"기록"이란 이용자가 서비스 내에 입력·저장한 텍스트 데이터를 말합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제3조 (약관의 효력 및 변경)</h2>
          <p className="text-muted-foreground">
            이 약관은 서비스 화면에 게시하거나 이용자에게 공지함으로써 효력이 발생합니다. 서비스는 합리적인 사유가 있을 경우 약관을 변경할 수 있으며, 변경 시 7일 전에 공지합니다. 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제4조 (서비스 이용)</h2>
          <ul className="space-y-1 text-muted-foreground list-disc pl-5">
            <li>이용자는 회원가입 시 정확한 정보를 입력해야 하며, 허위 정보 입력으로 발생한 불이익은 이용자가 부담합니다.</li>
            <li>계정 정보(이메일, 비밀번호)의 관리 책임은 이용자에게 있습니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제5조 (AI 분석의 한계)</h2>
          <p className="text-muted-foreground">
            서비스가 제공하는 인지 오류 분석 결과는 AI 모델에 의해 생성된 참고 정보이며, 전문적인 심리 상담이나 의료 진단을 대체하지 않습니다. 분석 결과의 정확성을 보장하지 않으며, 이를 근거로 한 판단·행동에 대한 책임은 이용자에게 있습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제6조 (이용자의 의무)</h2>
          <ul className="space-y-1 text-muted-foreground list-disc pl-5">
            <li>타인의 개인정보, 저작권, 명예를 침해하는 내용을 입력해서는 안 됩니다.</li>
            <li>서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</li>
            <li>불법·유해 정보를 입력하거나 유포해서는 안 됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제7조 (서비스 중단)</h2>
          <p className="text-muted-foreground">
            서비스는 시스템 점검, 장애, 천재지변 등 불가피한 사유로 서비스를 일시 중단할 수 있습니다. 서비스 중단으로 발생한 손해에 대해 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제8조 (탈퇴 및 데이터 삭제)</h2>
          <p className="text-muted-foreground">
            이용자는 언제든지 서비스 탈퇴를 요청할 수 있습니다. 탈퇴 시 이용자의 기록 및 개인정보는 관계 법령에서 정한 기간을 제외하고 즉시 삭제됩니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제9조 (준거법 및 관할)</h2>
          <p className="text-muted-foreground">
            이 약관은 대한민국 법률에 따라 해석되며, 서비스 이용으로 발생한 분쟁은 민사소송법상 관할 법원을 제1심 관할로 합니다.
          </p>
        </section>
      </div>

      <div className="mt-10 border-t pt-6">
        <Link href="/register/terms" className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
          ← 약관 동의 페이지로 돌아가기
        </Link>
      </div>
    </main>
  );
}
