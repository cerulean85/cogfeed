# Feature Spec: 무료/유료 등급 분리 및 RevenueCat 인앱결제 (IAP)

> Priority: Must-have (Phase 2 수익화 핵심)
> ADR 참조: docs/decisions.md ADR-008
> Architecture 참조: docs/ARCHITECTURE.md 섹션 4.2 (`Subscription`, `User.planTier`)

---

## 1. Goal

무료(`FREE`)와 유료(`PRO`) 회원 등급을 분리하여 일일 AI 분석 쿼터를 관리하고, iOS App Store 및 Google Play Store 인앱결제(RevenueCat 연동)를 통해 Pro 정기 구독 전환을 달성한다.

---

## 2. Tier & Entitlement Policy

| 항목 | FREE (무료 등급) | PRO (유료 구독) |
|------|------------------|-----------------|
| 일일 AI 인지 오류 분석 | **일 3회 제한** (KST 자정 초기화) | **무제한 실시간 분석** |
| 단건 인지 오류 피드백 | 기본 제공 | 기본 제공 + 심층 교정 가이드 |
| 장기 인지 패턴 리포트 | 블러(Blur) 미리보기만 제공 | **주간/월간 Clarity 추이 & Top 3 오류 분포 전체 열람** |
| 광고 노출 | 사이드바/배너 광고 노출 | **광고 완전 제거 (Ad-free)** |
| 구독 상품 ID | - | `cogfeed_pro_monthly` (월간), `cogfeed_pro_yearly` (연간) |

---

## 3. Acceptance Criteria

- [ ] 무료 회원이 하루 3회 이상 AI 분석(`analyzeNow: true`)을 요청하면 `402 PAYMENT_REQUIRED` (`QUOTA_EXCEEDED`) 응답과 함께 Paywall 모달이 표시된다.
- [ ] 무료 회원도 `analyzeNow: false`(단순 기록 저장)는 횟수 제한 없이 저장할 수 있다.
- [ ] Paywall 화면에서 월간/연간 플랜 선택, 인앱결제 구매 실행, 구매 복원(Restore Purchases)이 동작한다.
- [ ] RevenueCat Webhook(`POST /api/v1/webhooks/revenuecat`)이 `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION`, `BILLING_ISSUE` 이벤트를 수신해 `Subscription` 및 `User.planTier`를 자동 동기화한다.
- [ ] `PRO` 등급 회원은 사이드바 및 모바일 화면에서 외부 광고(쿠팡 배너 등)가 숨김 처리된다.

---

## 4. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/subscription` | 현재 사용자의 등급(`planTier`), 오늘 남은 무료 분석 횟수(`remainingToday`), 구독 상세 상태 조회 |
| POST | `/api/v1/subscription/checkout` | 개발/웹 환경 테스트용 구독 활성화 및 RevenueCat 고객 동기화 |
| POST | `/api/v1/webhooks/revenuecat` | RevenueCat 서버 웹훅 수신 (`Authorization: Bearer <REVENUECAT_WEBHOOK_SECRET>`) |

