import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "CogFeed <noreply@cogfeed.app>";
const BASE_URL = process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

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
