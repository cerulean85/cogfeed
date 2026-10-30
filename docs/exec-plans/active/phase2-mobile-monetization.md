# Execution Plan: Phase 2 — 모바일 네이티브 앱 출시 · 서비스 개선 · 수익화(RevenueCat)

> **Created**: 2026-10-30
> **Goal**: 네이티브 모바일 앱(Capacitor) 전환, 모바일 전용 UI/UX & 장기 인지 패턴 리포트 구축, 소셜 로그인(Google/Kakao/Apple), 무료/유료 등급 분리 및 RevenueCat 인앱결제 도입
> **Reference**:
> - ADRs: [docs/decisions.md](../../decisions.md) (ADR-007 ~ ADR-009)
> - Specs:
>   - [05-subscription-iap.md](../../product-specs/05-subscription-iap.md)
>   - [06-mobile-ux-and-analytics.md](../../product-specs/06-mobile-ux-and-analytics.md)
>   - [07-social-auth.md](../../product-specs/07-social-auth.md)

---

## Status Legend
- 🔲 Not started
- 🔄 In progress
- ✅ Completed
- ⏸ Blocked

---

## Sprint 4 — DB 스키마 확장 & 무료/유료 등급(Quota) 엔진

| # | Task | Spec | Status | Notes |
|---|------|------|--------|-------|
| 4-1 | `prisma/schema.prisma` 확장 (`PlanTier`, `Subscription`, `Account`, `currentStreak`) | 05-subscription-iap.md | 🔲 | Free/Pro 등급 및 OAuth 계정 테이블 |
| 4-2 | 일일 무료 AI 분석 쿼터(일 3회) 체크 및 Streak 갱신 로직 구현 (`/api/v1/records`) | 05-subscription-iap.md | 🔲 | 초과 시 `402 QUOTA_EXCEEDED` 반환 |
| 4-3 | 구독 조회/관리 API (`/api/v1/subscription`) 및 RevenueCat Webhook (`/api/v1/webhooks/revenuecat`) 구현 | 05-subscription-iap.md | 🔲 | 구독 상태 DB 동기화 |
| 4-4 | Pro 등급 광고 제거 처리 (`Sidebar` 쿠팡 배너 조건부 렌더링) | 05-subscription-iap.md | 🔲 | `planTier === 'PRO'` 시 광고 비노출 |

---

## Sprint 5 — 모바일 전용 UI/UX 개편 & 장기 인지 패턴 리포트

| # | Task | Spec | Status | Notes |
|---|------|------|--------|-------|
| 5-1 | 모바일 하단 플로팅 액션 탭바(FAB) 및 빠른 기록 바텀시트 드로어 구현 | 06-mobile-ux-and-analytics.md | 🔲 | 어느 화면에서나 즉시 기록 작성 |
| 5-2 | 장기 인지 패턴 분석 API (`/api/v1/analytics`) 구현 | 06-mobile-ux-and-analytics.md | 🔲 | 주간/월간 Clarity 추이, Top 3 오류 집계, Streak |
| 5-3 | 대시보드 고도화 (Streak 배지, 남은 무료 횟수 게이지, 인지 오류 분포 차트, Pro 리포트 잠금/해제) | 06-mobile-ux-and-analytics.md | 🔲 | `dashboard-view.tsx` 개편 |

---

## Sprint 6 — RevenueCat 인앱결제 Paywall & 소셜 로그인

| # | Task | Spec | Status | Notes |
|---|------|------|--------|-------|
| 6-1 | Paywall 모달 및 구독 관리 화면 구현 (`src/features/subscription/ui`) | 05-subscription-iap.md | 🔲 | 월간/연간 플랜 선택, 구매 복원, RevenueCat 브릿지 |
| 6-2 | NextAuth v5 Google / Kakao / Apple 프로바이더 연동 (`src/auth.ts`) | 07-social-auth.md | 🔲 | OAuth 환경변수 및 콜백 처리 |
| 6-3 | 로그인/회원가입 화면 원클릭 소셜 로그인 버튼 UI 구현 | 07-social-auth.md | 🔲 | 카카오/구글/애플 공식 스타일 버튼 |

---

## Sprint 7 — Capacitor 네이티브 앱 패키징 설정

| # | Task | Spec | Status | Notes |
|---|------|------|--------|-------|
| 7-1 | Capacitor 설정 (`capacitor.config.ts`) 및 네이티브 브릿지 유틸리티 구성 | ADR-007 | 🔲 | Safe Area, Haptics, RevenueCat Capacitor 연동 준비 |
| 7-2 | 모바일/수익화 통합 검증 및 `QUALITY_SCORE.md` 자가 점검 | QUALITY_SCORE.md | 🔲 | 빌드 및 린트 검증 |

