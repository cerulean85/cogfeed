import { z } from "zod";

export const checkoutSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "카드 번호 형식이 올바르지 않습니다. (예: 1234 5678 9012 3456)"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "만료일 형식이 올바르지 않습니다. (예: 12/27)"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC는 3~4자리 숫자입니다."),
  cardHolder: z.string().min(2, "카드 소유자 이름을 입력해 주세요."),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
