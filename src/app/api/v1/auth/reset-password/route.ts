import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/shared/lib/prisma";
import { hashPassword } from "@/shared/lib/auth";

const schema = z.object({
  token: z.string().uuid(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }

  const { token, password } = parsed.data;

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record) {
    return NextResponse.json({ error: "유효하지 않은 링크입니다." }, { status: 400 });
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json({ error: "링크가 만료되었습니다. 다시 요청해 주세요." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: record.identifier } });

  if (!user) {
    return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(password) },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ message: "비밀번호가 변경되었습니다." });
}
