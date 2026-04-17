import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침 — CogFeed",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-foreground">
      <div className="mb-8 space-y-1">
        <p className="text-xs text-muted-foreground">시행일: 2026년 4월 17일</p>
        <h1 className="text-2xl font-bold tracking-tight">개인정보 처리방침</h1>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-2 font-semibold text-base">제1조 (수집하는 개인정보 항목)</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>서비스는 회원가입 및 서비스 제공을 위해 다음 정보를 수집합니다.</p>
            <div>
              <p className="font-medium text-foreground mb-1">필수 항목</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>이메일 주소 (계정 식별 및 비밀번호 재설정)</li>
                <li>비밀번호 (암호화 저장)</li>
                <li>서비스 이용 기록 (작성한 기록, 분석 결과)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">자동 수집 항목</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>접속 IP, 브라우저 정보, 서비스 이용 일시</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제2조 (개인정보 수집 목적)</h2>
          <ul className="space-y-1 text-muted-foreground list-disc pl-5">
            <li>회원 식별 및 서비스 이용 관리</li>
            <li>AI 인지 오류 분석 서비스 제공</li>
            <li>비밀번호 재설정 등 고객 지원</li>
            <li>서비스 개선 및 통계 분석 (개인 식별 불가 형태)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제3조 (개인정보 보유 및 이용 기간)</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>회원 탈퇴 시 즉시 삭제합니다. 단, 관계 법령에 따라 아래 정보는 일정 기간 보존합니다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>전자상거래 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
              <li>로그인 기록: 3개월 (통신비밀보호법)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제4조 (개인정보 제3자 제공)</h2>
          <p className="text-muted-foreground">
            서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의한 수사기관의 요청이 있을 경우에는 예외로 합니다.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제5조 (개인정보 처리 위탁)</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-muted-foreground text-xs">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4 text-left font-medium text-foreground">수탁 업체</th>
                  <th className="py-2 pr-4 text-left font-medium text-foreground">위탁 업무</th>
                  <th className="py-2 text-left font-medium text-foreground">보유 기간</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-2 pr-4">Anthropic</td>
                  <td className="py-2 pr-4">AI 인지 오류 분석 처리</td>
                  <td className="py-2">처리 후 즉시 삭제</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Resend</td>
                  <td className="py-2 pr-4">이메일 발송</td>
                  <td className="py-2">발송 후 즉시 삭제</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Vercel</td>
                  <td className="py-2 pr-4">서비스 호스팅</td>
                  <td className="py-2">회원 탈퇴 시</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제6조 (이용자의 권리)</h2>
          <p className="text-muted-foreground">
            이용자는 언제든지 자신의 개인정보를 조회·수정·삭제할 수 있으며, 서비스 탈퇴를 통해 개인정보 처리를 정지할 수 있습니다. 개인정보 관련 문의는 아래 연락처로 요청해 주세요.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제7조 (개인정보 보호 조치)</h2>
          <ul className="space-y-1 text-muted-foreground list-disc pl-5">
            <li>비밀번호는 bcrypt 알고리즘으로 단방향 암호화 저장</li>
            <li>HTTPS를 통한 데이터 전송 암호화</li>
            <li>최소 권한 원칙에 따른 접근 통제</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-base">제8조 (개인정보 보호 책임자)</h2>
          <div className="rounded-md border p-4 text-muted-foreground space-y-1">
            <p>이메일: <a href="mailto:zhwan85@dycdyp.com" className="underline underline-offset-2 hover:text-foreground">zhwan85@dycdyp.com</a></p>
          </div>
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
