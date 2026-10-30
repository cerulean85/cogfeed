# QUALITY_SCORE.md — 품질 기준 & Self-Review 체크리스트

> 모든 태스크 완료 전 이 체크리스트를 통과해야 합니다.
> 항목을 건너뛰려면 이유를 docs/decisions.md에 기록하세요.

---

## 1. Product Quality

| # | 체크 항목 | 기준 |
|---|---------|------|
| P1 | PRD Must-have 요건 충족 | docs/target_prd.md 섹션 5 MoSCoW 확인 |
| P2 | MVP Go 기준과 연결 | DAU·전환율·피드백 반영률 지표 고려 |
| P3 | 페르소나 JTBD 충족 | 3개 페르소나 중 최소 1명의 Job을 해결하는가 |

---

## 2. UX Quality

| # | 체크 항목 | 기준 |
|---|---------|------|
| U1 | 4대 UX 원칙 | 직관성·효율성·접근성·일관성 (docs/DESIGN.md) |
| U2 | 화면 당 CTA 1개 | 복수 CTA는 허용 근거 명시 필요 |
| U3 | 최대 Depth 3 준수 | 화면 계층 3단계 초과 금지 |
| U4 | 오류 상태 처리 | 오류 메시지 + 복구 경로 필수 |
| U5 | Nielsen Heuristic #5 | 오류 예방: 저장 전 필수 입력 검증 |

---

## 3. Accessibility Quality

| # | 체크 항목 | 기준 |
|---|---------|------|
| A1 | ARIA label | 모든 인터랙티브 요소에 명시 |
| A2 | 클릭 영역 | 최소 44×44px (WCAG 2.5.5) |
| A3 | 색 외 상태 표시 | 색만으로 전달하는 정보 금지 |
| A4 | 키보드 네비게이션 | Tab/Shift+Tab/Enter/Escape 단독 조작 가능 |
| A5 | 스크린 리더 | h1 최상단, role="alert" 오류 메시지 |

---

## 4. Documentation Quality

| # | 체크 항목 | 기준 |
|---|---------|------|
| D1 | 관련 docs/ 파일 최신화 | 작업 완료 시 즉시 업데이트 |
| D2 | 결정 사항 ADR 기록 | docs/decisions.md 추가 |
| D3 | 실행 계획 태스크 완료 처리 | docs/exec-plans/active/ 파일 업데이트 |
| D4 | STUB 파일 해소 | [STUB] 표시 파일은 내용 추가 후 제거 |

---

## 5. Score 산정

> 각 항목 Pass=1, Fail=0. 총점 / 13 × 100 = Quality Score

총 항목 수: 14개

| Score | 판정 |
|-------|------|
| 100% | ✅ Ship |
| 85–99% | ⚠️ Minor fix 후 Ship |
| 70–84% | 🔧 Rework 필요 |
| < 70% | ❌ 재설계 |

---

## Change Log

| Date | Version | Change |
|------|---------|--------|
| 2026-04-15 | v0.1 | 초안 작성 |
