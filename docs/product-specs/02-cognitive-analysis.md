# Feature Spec: 인지 오류 분석 기능

> RICE Score: 450 | Priority: Must-have (P1)
> PRD 참조: docs/target_prd.md 섹션 5
> Architecture 참조: docs/ARCHITECTURE.md (AI 분석 엔진 TBD)

---

## 1. Goal

사용자가 저장한 기록을 AI가 분석하여 인지 오류 유형과 개선 피드백을 제공한다.

---

## 2. User Story

- IT 개발자: "내 기술 이해 기록에서 논리적 오류나 확증 편향을 확인할 수 있다."
- 마케팅 전문가: "데이터 분석 메모에서 가용성 편향이나 앵커링 오류를 감지할 수 있다."

---

## 3. Acceptance Criteria

- [ ] 기록 저장 완료 후 자동으로 분석 요청 시작
- [ ] 분석 결과 화면에서 인지 오류 유형 목록 표시
- [ ] 각 오류에 대한 개인화 피드백 문장 표시
- [ ] 분석 완료 전 로딩 인디케이터 표시
- [ ] 분석 실패 시 오류 안내 + 재시도 옵션

---

## 4. Cognitive Error Types

| 한국어 | 영문 | 심각도(기본) |
|--------|------|------------|
| 확증 편향 | Confirmation Bias | medium |
| 가용성 편향 | Availability Heuristic | medium |
| 앵커링 오류 | Anchoring | medium |
| 흑백 논리 | Black-and-White Thinking | medium |
| 과일반화 | Overgeneralization | medium |
| 감정적 추론 | Emotional Reasoning | medium |
| 선택적 추상화 | Selective Abstraction | medium |
| 파국화 | Catastrophizing | high |

- 심각도(severity): `low` / `medium` / `high` — AI가 판단, 기본값 `medium`
- 분석 결과에 `clarityScore` (0–100) 포함: 오류 없음=100, 심각한 오류 다수=0

---

## 5. UI Components

| Component | Spec |
|-----------|------|
| 분석 결과 영역 | ARIA label="인지 오류 분석 결과" |
| 피드백 메시지 | ARIA label="피드백 메시지", 개인화 텍스트 |
| 확인 버튼 | ARIA label="확인", 44×44px → 대시보드 이동 |

---

## 6. Out of Scope (MVP)

- 과거 분석 결과 비교 (시계열 트렌드)
- AI 정서 분석
- 공유 기능
