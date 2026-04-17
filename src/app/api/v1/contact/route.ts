import { NextResponse } from "next/server";
import { z } from "zod";

import { sendContactEmail } from "@/shared/lib/email";

const schema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "입력값을 확인해 주세요." }, { status: 400 });
  }

  const { name, email, message } = parsed.data;

  try {
    await sendContactEmail(name, email, message);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "메일 발송에 실패했습니다." }, { status: 500 });
  }
}
