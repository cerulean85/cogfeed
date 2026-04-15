export type CognitiveError = {
  type: string;         // 한국어 오류명 (예: "확증 편향")
  type_en: string;      // 영문명 (예: "Confirmation Bias")
  severity: "low" | "medium" | "high";
  excerpt: string;      // 원문에서 인용한 관련 부분
  explanation: string;  // 왜 인지 오류인지
  suggestion: string;   // 개선 방향
};

export type AnalysisResult = {
  errors: CognitiveError[];
  overall_feedback: string;
  clarity_score: number; // 0–100
};
