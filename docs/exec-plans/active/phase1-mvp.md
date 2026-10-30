# Execution Plan: Phase 1 MVP

> **Period**: 3개월 (시작일 TBD)
> **Goal**: 5개 핵심 기능 구현 및 MVP Go 기준 달성
> **Reference**: docs/target_prd.md 섹션 6, docs/product-specs/

---

## Status Legend
- 🔲 Not started
- 🔄 In progress
- ✅ Completed
- ⏸ Blocked

---

## Sprint 0 — 기반 작업

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 0-1 | CLAUDE.md 및 docs/ 구조 확정 | Agent | ✅ | 2026-04-15 완료 |
| 0-2 | ARCHITECTURE.md 기술 스택 확정 | Agent | ✅ | 2026-04-15: Next.js 15 + TypeScript + Tailwind + shadcn/ui |
| 0-3 | DESIGN.md 디자인 토큰 확정 | Agent | ✅ | 2026-04-15: shadcn/ui 기본 토큰 적용 (디자이너 확정 시 업데이트) |
| 0-4 | ADR-004 AI 엔진 선택 | Agent | ✅ | 2026-04-15: Anthropic Claude API (decisions.md ADR-004 참조) |

---

## Sprint 1 — 온보딩 & 기록 작성 (RICE 최우선)

| # | Task | Spec | Status |
|---|------|------|--------|
| 1-1 | 회원가입 화면 구현 | docs/product-specs/04-onboarding.md | ✅ | 2026-04-15: src/app/(auth)/register/page.tsx |
| 1-2 | 이용약관 동의 화면 | docs/product-specs/04-onboarding.md | ✅ | 2026-04-15: src/app/(auth)/register/terms/page.tsx |
| 1-3 | 온보딩 가이드 화면 | docs/product-specs/04-onboarding.md | ✅ | 2026-04-15: src/app/(auth)/onboarding/page.tsx |
| 1-4 | 대시보드 화면 구현 | docs/ux_design_output.md 섹션 4 | ✅ | 2026-04-15: src/app/(dashboard)/dashboard/page.tsx |
| 1-5 | 기록 입력 화면 구현 | docs/product-specs/01-record-writing.md | ✅ | 2026-04-15: src/app/(dashboard)/records/new/page.tsx |
| 1-6 | 기록 저장 API 연동 | docs/ARCHITECTURE.md | ✅ | 2026-04-15: src/app/api/records/route.ts (더미, Sprint 2에서 DB 연동) |

---

## Sprint 2 — 인지 오류 분석 & 피드백

| # | Task | Spec | Status |
|---|------|------|--------|
| 2-1 | AI 분석 API 연동 | docs/product-specs/02-cognitive-analysis.md | ✅ | 2026-04-15: src/lib/analyze.ts + /api/records/[id]/ |
| 2-2 | 피드백 화면 구현 | docs/ux_design_output.md 섹션 4 | ✅ | 2026-04-15: src/app/(dashboard)/feedback/[id]/page.tsx |
| 2-3 | 실시간 피드백 성능 검증 | docs/product-specs/03-realtime-feedback.md | ✅ | 2026-04-15: loading.tsx Suspense + elapsed 로그, spec 업데이트 |

---

## Sprint 3 — QA

| # | Task | Spec | Status |
|---|------|------|--------|
| 3-3 | 접근성 전체 점검 | docs/QUALITY_SCORE.md A1–A5 | ✅ | 2026-04-15: skip-to-main, aria-label 48개, role=alert 14개, focus-visible |
| 3-4 | 사용자 검증 테스트 (15명) | docs/target_prd.md 섹션 10 | ⏸ | 스킵 |
| 3-5 | MVP Go/No-Go 판정 | docs/target_prd.md 섹션 6.2 | 🔲 | 3-4 완료 후 |

---

## MVP Go Criteria (체크 후 배포)

- [ ] DAU 800+ 3일 연속
- [ ] 회원가입 후 3일 내 전환율 7%+
- [ ] 오류 피드백 반영률 30%+
- [ ] Quality Score ≥ 85%
