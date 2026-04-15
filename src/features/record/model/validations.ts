import { z } from "zod";

export const recordSchema = z.object({
  content: z
    .string()
    .min(20, "20자 이상 입력해 주세요.")
    .max(500, "500자를 초과할 수 없습니다."),
});

export type RecordFormValues = z.infer<typeof recordSchema>;
