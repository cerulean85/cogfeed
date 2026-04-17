import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "CogFeed <noreply@cogfeed.app>";
const BASE_URL = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";

export async function sendContactEmail(name: string, email: string, message: string) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  await resend.emails.send({
    from: FROM,
    to: "zhwan85@dycdyp.com",
    replyTo: safeEmail,
    subject: `[CogFeed 문의] ${safeName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <h2 style="margin: 0 0 16px; font-size: 20px;">새 문의가 도착했습니다</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #555; width: 80px;">이름</td><td style="padding: 8px 0;">${safeName}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;">이메일</td><td style="padding: 8px 0;">${safeEmail}</td></tr>
        </table>
        <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "[CogFeed] 비밀번호 재설정",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <h2 style="margin: 0 0 8px; font-size: 20px;">비밀번호 재설정</h2>
        <p style="margin: 0 0 24px; color: #555; font-size: 14px; line-height: 1.6;">
          아래 버튼을 클릭해 새 비밀번호를 설정하세요.<br/>
          링크는 <strong>1시간</strong> 동안 유효합니다.
        </p>
        <a
          href="${resetUrl}"
          style="display: inline-block; padding: 12px 24px; background: #1a1a1a; color: #fff; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none;"
        >
          비밀번호 재설정
        </a>
        <p style="margin: 24px 0 0; font-size: 12px; color: #999;">
          이 요청을 하지 않으셨다면 이 이메일을 무시하세요.
        </p>
      </div>
    `,
  });
}
