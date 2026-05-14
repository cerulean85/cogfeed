import { z } from "zod";

type AuthValidationMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMin: string;
  passwordMax: string;
  passwordConfirmRequired: string;
  passwordMismatch: string;
};

const defaultMessages: AuthValidationMessages = {
  emailRequired: "이메일을 입력해 주세요.",
  emailInvalid: "유효한 이메일 주소를 입력해 주세요.",
  passwordRequired: "비밀번호를 입력해 주세요.",
  passwordMin: "비밀번호는 8자 이상이어야 합니다.",
  passwordMax: "비밀번호가 너무 깁니다.",
  passwordConfirmRequired: "비밀번호 확인을 입력해 주세요.",
  passwordMismatch: "비밀번호가 일치하지 않습니다.",
};

export function createRegisterSchema(messages: AuthValidationMessages = defaultMessages) {
  return z
    .object({
      email: z
        .string()
        .min(1, messages.emailRequired)
        .email(messages.emailInvalid),
      password: z
        .string()
        .min(8, messages.passwordMin)
        .max(100, messages.passwordMax),
      passwordConfirm: z.string().min(1, messages.passwordConfirmRequired),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: messages.passwordMismatch,
      path: ["passwordConfirm"],
    });
}

export function createLoginSchema(messages: Pick<AuthValidationMessages, "emailRequired" | "emailInvalid" | "passwordRequired"> = defaultMessages) {
  return z.object({
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z.string().min(1, messages.passwordRequired),
  });
}

export const registerSchema = createRegisterSchema();

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = createLoginSchema();

export type LoginFormValues = z.infer<typeof loginSchema>;
