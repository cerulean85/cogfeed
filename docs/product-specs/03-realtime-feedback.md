# Feature Spec: 실시간 피드백 기능

> RICE Score: 160 | Priority: Must-have (P1)
> PRD 참조: docs/target_prd.md 섹션 5

---

## 1. Goal

기록 저장 후 즉시 인지 오류 피드백을 제공하여 사용자가 즉각적으로 사고를 개선할 수 있다.

---

## 2. Acceptance Criteria

- [ ] 저장 → 분석 → 피드백 화면까지 체감 응답 시간 3초 이내 (목표)
- [ ] 피드백을 비활성화하고 기록만 저장하는 옵션 제공 (Alternative Path)
- [ ] 피드백 화면에서 "다시 작성" 액션 제공

---

## 3. Performance Target

> AI 엔진: Anthropic Claude claude-sonnet-4-5 (2026-04-15 확정)

| Metric | Target | 측정 방법 |
|--------|--------|---------|
| P50 응답 시간 | < 2s | POST /api/records elapsed 로그 |
| P95 응답 시간 | < 5s | POST /api/records elapsed 로그 |
| 분석 성공률 | > 99% | analysisStatus=error 비율 모니터링 |

### 로딩 UX
- 저장 버튼 클릭 → 버튼 비활성화 + "저장 중..." 텍스트
- 서버에서 분석 완료 후 → `/feedback/[id]`로 이동
- 이동 직후 Next.js `loading.tsx` Suspense fallback으로 스피너 표시
- 분석 결과 렌더링 완료 → 피드백 화면 전환

---

## 4. Out of Scope (MVP)

- 기록 작성 중 인라인 실시간 분석 (타이핑 중 감지)
- 푸시 알림 기반 비동기 피드백
