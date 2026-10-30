# decisions.md — Architecture Decision Records (ADR)

> 모든 주요 기술·설계 결정은 여기에 기록합니다.
> 형식: 결정 배경 → 선택지 → 결정 내용 → 결과

---

## ADR-001: 수익 모델 — 구독 + 광고 혼합

**Date**: 2026-04-13
**Status**: Updated (2026-04-17)

**Context**: 수익 모델 선택. 광고 기반 vs 구독 기반.

**Decision**: 구독 모델을 기본으로 하되, 광고도 병행 허용.

**Consequences**: 구독 전환율과 광고 수익을 병행 모니터링 필요.

---

## ADR-002: Web-first, 반응형 웹 서비스

**Date**: 2026-04-15
**Status**: Confirmed (2026-04-15 변경 — 모바일 앱 → 웹)

**Context**: 플랫폼 선택 및 네비게이션 패턴.

**Decision**: 반응형 웹 서비스. 사이드바 네비게이션(데스크톱) + 햄버거 메뉴(모바일 브라우저).

**Rationale**: 모바일 앱 대비 배포·업데이트 주기가 빠르고, 앱스토어 심사 불필요. 타겟 페르소나(IT 개발자·마케팅 전문가·작가)가 주로 데스크톱에서 업무 중 사용하는 시나리오에 더 적합.

**Consequences**: 
- 화면 설계는 Desktop/Tablet/Mobile 3 브레이크포인트 기준.
- 키보드 네비게이션 필수 지원 (WCAG 2.1 AA).
- 네이티브 앱 배포(App Store/Play Store)는 Post-MVP.

---

## ADR-003: Phase 1 MVP 기능 범위 확정

**Date**: 2026-04-13
**Status**: Confirmed

**Context**: MVP 범위 결정. 무엇을 넣고 무엇을 뺄 것인가.

**Decision**: 5개 기능만 MVP 포함 (기록 작성, 인지 오류 분석, 실시간 피드백, 온보딩, 구독 관리).

**Excluded (명시적 제외)**:
- 채팅/포럼: 운영 비용 高, 핵심 가치와 무관
- AI 정서 분석: 데이터 부족, 자원 과다
- 다국어 지원: 초기 타겟 한국 내 사용자 한정
- 소셜 공유, 커스터마이징: Phase 3

**Rationale**: RICE 점수 기반 우선순위 (docs/target_prd.md 섹션 5 참조).

---

## ADR-004: AI 분석 엔진 — Anthropic Claude API

**Date**: 2026-04-15
**Status**: Confirmed

**Context**: 인지 오류 실시간 분석을 위한 AI 엔진. 자체 모델 vs LLM API.

**Options**:
1. Anthropic Claude API
2. OpenAI GPT API
3. 자체 파인튜닝 모델
4. 규칙 기반 분류기 + LLM 혼합

**Decision**: Anthropic Claude API (`claude-sonnet-4-5` 모델).

**Rationale**:
- MVP 속도 최적화 — 파인튜닝 없이 즉시 사용 가능
- 한국어 텍스트 분석 품질 검증됨
- System prompt로 인지 오류 유형 가이드 주입 → 커스터마이징 용이
- 자체 모델 대비 인프라 부담 없음 (MVP 단계 적합)

**Consequences**:
- API 비용 모니터링 필요 (사용량 기반 과금)
- P95 < 5s 목표는 Claude API 응답 시간 의존
- 프롬프트 엔지니어링이 분석 품질의 핵심 변수

## ADR-006: 멀티 AI 프로바이더 추상화

**Date**: 2026-04-15
**Status**: Confirmed

**Context**: Anthropic만 지원하던 분석 엔진에 OpenAI도 추가 요구.

**Decision**: 프로바이더 추상화 레이어 도입. `AI_PROVIDER` 환경변수로 전환.

**구현**:
- `src/lib/ai/anthropic.ts` — Anthropic 구현
- `src/lib/ai/openai.ts` — OpenAI 구현
- `src/lib/ai/prompt.ts` — 공유 시스템 프롬프트
- `src/lib/analyze.ts` — 팩토리 (`resolveProvider`)

**전환 방법**: `.env.local`에서 `AI_PROVIDER=openai` 한 줄만 변경.

**Consequences**: 시스템 프롬프트가 하나이므로 모델 간 응답 품질 차이 발생 가능. 모델별 프롬프트 튜닝은 Post-MVP.

---

## ADR-005: 기술 스택 — Next.js 15 모노레포

**Date**: 2026-04-15
**Status**: Confirmed

**Context**: 웹 클라이언트 + 백엔드 API 구조 선택.

**Decision**: Next.js 15 App Router + TypeScript. 프론트+API를 단일 레포에서 관리.

**Rationale**: MVP 속도 최우선. 별도 백엔드 서버(NestJS 등) 구축 없이 API Routes로 충분.
Scale 단계에서 API 서버 분리 검토.

**Consequences**: 서버/클라이언트 경계를 App Router 컨벤션으로 명확히 관리해야 함.

---

## ADR-007: 모바일 네이티브 앱 출시 — Capacitor 하이브리드 아키텍처

**Date**: 2026-10-30
**Status**: Confirmed

**Context**: 웹 서비스를 App Store / Google Play 네이티브 앱으로 출시하고 모바일 전용 UX(하단 플로팅 탭바, 바텀시트 기록, 제스처, 햅틱)를 제공해야 함.

**Options**:
1. Capacitor 기반 하이브리드 네이티브 앱 (현재 Next.js 코드베이스 95%+ 재사용)
2. React Native (Expo) 별도 앱 신설 (UI 100% 재작성)
3. PWA 단독 유지 (스토어 미출시)

**Decision**: 옵션 1 — Capacitor 기반 네이티브 패키징 + 모바일 전용 네이티브 UI/UX 전면 개편.

**Rationale**:
- 기존 Next.js 16 + Tailwind v4 + 다국어/인증/API 자산을 그대로 유지하며 출시 기간을 1~2주로 단축.
- `@revenuecat/purchases-capacitor` 공식 SDK를 통해 iOS/Android 인앱결제 완벽 지원.
- 앱스토어 가이드라인 4.2(최소 기능성) 통과를 위해 모바일 전용 바텀시트 기록 드로어, 플로팅 액션 탭바(FAB), 네이티브 햅틱/푸시/제스처 UX를 적용.

**Consequences**:
- `capacitor.config.ts` 및 iOS/Android 네이티브 브릿지 레이어 관리 필요.
- 웹과 네이티브 환경을 분기하는 플랫폼 감지 유틸리티 필요.

---

## ADR-008: 수익화 및 결제 — Freemium 등급 분리 + RevenueCat 인앱결제(IAP)

**Date**: 2026-10-30
**Status**: Confirmed (ADR-001 확장)

**Context**: 모바일 앱 출시와 함께 실질적인 유료 구독 수익화 모델 도입 필요.

**Decision**:
- **Freemium 모델**:
  - `FREE` 등급: 일 3회 AI 인지 오류 분석 제한, 단건 기본 피드백 열람, 배너 광고 노출.
  - `PRO` 등급: 무제한 실시간 AI 분석, 주간/월간 장기 인지 패턴 심층 리포트 잠금 해제, 광고 완전 제거.
- **결제 인프라**: App Store / Play Store 인앱결제(IAP) + **RevenueCat** 연동 (`/api/v1/webhooks/revenuecat` 웹훅으로 DB `Subscription` 및 `User.planTier` 실시간 동기화).

**Consequences**:
- `prisma/schema.prisma`에 `PlanTier` enum(`FREE`, `PRO`) 및 `Subscription` 테이블 추가.
- `POST /api/v1/records`에서 무료 회원 일일 분석 쿼터 초과 시 `402 PAYMENT_REQUIRED` (`QUOTA_EXCEEDED`) 반환 및 Paywall 유도.

---

## ADR-009: 소셜 로그인 도입 — Google, Kakao, Apple OAuth

**Date**: 2026-10-30
**Status**: Confirmed

**Context**: 모바일 환경에서 이메일/비밀번호 수동 입력으로 인한 온보딩 이탈률 최소화 및 iOS 앱스토어 심사 요건 충족.

**Decision**: NextAuth.js v5에 Google, Kakao, Apple OAuth 프로바이더 추가 및 `Account` 테이블 연동.

**Rationale**:
- 한국 모바일 사용자에게 가장 친숙한 카카오/구글 원클릭 로그인 제공.
- iOS 앱스토어 심사 가이드라인(타사 소셜 로그인 제공 시 Sign in with Apple 필수 포함) 준수.

**Consequences**:
- `User.passwordHash` nullable 유지 및 OAuth 계정 연결(`Account` 모델) 스키마 반영.

---

## Change Log

| Date | ADR | Change |
|------|-----|--------|
| 2026-04-15 | 001–003 | PRD 기반 초기 결정 사항 기록 |
| 2026-04-15 | 002 | 플랫폼 변경: Mobile 앱 → Web (반응형) |
| 2026-04-15 | 004–005 | AI 엔진(Anthropic Claude), 기술 스택(Next.js 15) 확정 |
| 2026-04-15 | 006 | 멀티 AI 프로바이더 추상화 (Anthropic + OpenAI) |
| 2026-10-30 | 007–009 | 모바일 네이티브 출시(Capacitor), RevenueCat 인앱결제(Freemium/Pro), 소셜 로그인(Google/Kakao/Apple) 확정 |
