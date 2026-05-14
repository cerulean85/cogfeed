import { z } from "zod";

type RecordValidationMessages = {
  recordMin: string;
  recordMax: string;
};

const defaultMessages: RecordValidationMessages = {
  recordMin: "20자 이상 입력해 주세요.",
  recordMax: "500자를 초과할 수 없습니다.",
};

export function createRecordSchema(messages: RecordValidationMessages = defaultMessages) {
  return z.object({
    content: z
      .string()
      .min(20, messages.recordMin)
      .max(500, messages.recordMax),
  });
}

export const recordSchema = createRecordSchema();

export type RecordFormValues = z.infer<typeof recordSchema>;
