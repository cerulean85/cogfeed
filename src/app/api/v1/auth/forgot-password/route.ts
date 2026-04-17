import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/shared/lib/prisma";
import { sendPasswordResetEmail } from "@/shared/lib/email";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "유효하지 않은 이메일입니다." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  // 보안: 이메일 존재 여부와 무관하게 동일한 응답 반환
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // 기존 토큰 삭제 후 새 토큰 발급
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    const token = randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1시간

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    await sendPasswordResetEmail(email, token);
  }

  return NextResponse.json({
    message: "입력하신 이메일로 재설정 링크를 발송했습니다.",
  });
}
