# ARCHITECTURE.md — 기술 아키텍처

---

## 1. 기술 스택

| Layer | Technology | Status |
|-------|-----------|--------|
| Web & Mobile Client | Next.js 16 (App Router) + Capacitor (iOS/Android Native) | ✅ 확정 |
| Styling | Tailwind CSS v4 + shadcn/ui | ✅ 확정 |
| Forms | React Hook Form + Zod | ✅ 확정 |
| Auth | NextAuth.js v5 (Credentials + Google/Kakao/Apple OAuth) | ✅ 확정 |
| Backend API | Next.js API Routes (monorepo, `/api/v1/*`) | ✅ 확정 |
| Database | PostgreSQL + Prisma ORM | ✅ 확정 |
| AI/ML (인지 오류 분석) | Anthropic Claude API (`claude-sonnet-4-5`) + OpenAI | ✅ 확정 |
| Payment (IAP) | RevenueCat (`@revenuecat/purchases-capacitor` + Webhook) | ✅ 확정 |

---

## 2. 시스템 구조도 (TBD)

```
[Web Browser (반응형)]
    ↓ HTTPS
[Next.js App — App Router]
    ├── /app/(auth)/         ← 회원가입·로그인 (NextAuth.js)
    ├── /app/(dashboard)/    ← 대시보드·기록·피드백
    ├── /app/api/records/    ← 기록 CRUD API Routes
    ├── /app/api/analyze/    ← 인지 오류 분석 (Anthropic)
    └── /app/api/auth/       ← NextAuth handlers
    ↓
[Anthropic Claude API]   [PostgreSQL + Prisma]
```

---

## 3. Feasibility 검토 항목

> PRD 섹션 11 요청 사항 기반

- [ ] 실시간 인지 오류 분석 — 응답 지연 허용 범위, LLM 선택
- [ ] 실시간 피드백 — WebSocket vs Polling 결정
- [ ] 데이터 시각화 — 클라이언트 렌더링 전략

---

## 4. 데이터 모델

> 실제 스키마 파일: `prisma/schema.prisma`

### 4.1 ERD (테이블 관계)

```
User ──1:N──► Record ──1:1──► Analysis ──1:N──► CognitiveError
 │
 └──1:1──► Subscription

User ──1:N──► Account   (NextAuth.js)
User ──1:N──► Session   (NextAuth.js)
             VerificationToken  (NextAuth.js)
```

---

### 4.2 테이블 상세

#### `User`
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK | |
| email | VARCHAR | UNIQUE, NOT NULL | 로그인 식별자 |
| name | VARCHAR | NULL | 표시 이름 (소셜 로그인 연동) |
| image | TEXT | NULL | 프로필 이미지 URL |
| emailVerified | TIMESTAMPTZ | NULL | NextAuth 이메일 인증 시각 |
| passwordHash | TEXT | NULL | 소셜 로그인 시 null |
| planTier | ENUM | DEFAULT FREE | `FREE` / `PRO` 등급 |
| currentStreak | INT | DEFAULT 0 | 연속 일일 기록 달성 일수 |
| lastRecordAt | TIMESTAMPTZ | NULL | 마지막 기록 작성 시각 |
| onboardingCompleted | BOOLEAN | DEFAULT false | 온보딩 완료 여부 |
| createdAt | TIMESTAMPTZ | DEFAULT now() | |
| updatedAt | TIMESTAMPTZ | AUTO | |

#### `Subscription`
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK | |
| userId | UUID | FK → User, UNIQUE, CASCADE | 사용자당 1개 구독 상태 |
| revenueCatUserId | VARCHAR | UNIQUE, NOT NULL | RevenueCat `app_user_id` |
| productId | VARCHAR | NOT NULL | `cogfeed_pro_monthly` / `cogfeed_pro_yearly` |
| entitlementId | VARCHAR | DEFAULT 'pro' | RevenueCat Entitlement 식별자 |
| status | ENUM | DEFAULT ACTIVE | `ACTIVE` / `CANCELED` / `EXPIRED` / `BILLING_ISSUE` |
| store | VARCHAR | NULL | `APP_STORE` / `PLAY_STORE` / `WEB` |
| currentPeriodStart | TIMESTAMPTZ | NULL | 현재 구독 주기 시작일 |
| currentPeriodEnd | TIMESTAMPTZ | NULL | 현재 구독 주기 만료일 |
| createdAt | TIMESTAMPTZ | DEFAULT now() | |
| updatedAt | TIMESTAMPTZ | AUTO | |

#### `Record`
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK | |
| userId | UUID | FK → User, CASCADE | |
| content | VARCHAR(500) | NOT NULL | 기록 본문 (20–500자) |
| createdAt | TIMESTAMPTZ | DEFAULT now() | |
| updatedAt | TIMESTAMPTZ | AUTO | |

**인덱스**: `(userId, createdAt DESC)` — 목록 조회 최적화

#### `Analysis`
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK | |
| recordId | UUID | FK → Record, UNIQUE, CASCADE | Record당 1개 |
| status | ENUM | NOT NULL, DEFAULT pending | pending / completed / failed / skipped |
| overallFeedback | TEXT | NULL | 종합 피드백 (완료 시) |
| clarityScore | INT | NULL | 사고 명확도 점수 0–100 |
| retryCount | INT | DEFAULT 0 | 재시도 횟수 |
| analyzedAt | TIMESTAMPTZ | NULL | 분석 완료 시각 |
| createdAt | TIMESTAMPTZ | DEFAULT now() | |
| updatedAt | TIMESTAMPTZ | AUTO | |

#### `CognitiveError`
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID | PK | |
| analysisId | UUID | FK → Analysis, CASCADE | |
| type | ENUM | NOT NULL | 인지 오류 유형 코드 |
| severity | ENUM | NOT NULL, DEFAULT medium | low / medium / high |
| excerpt | TEXT | NOT NULL | 기록 내 해당 구절 |
| feedback | TEXT | NOT NULL | 개인화 개선 피드백 |
| createdAt | TIMESTAMPTZ | DEFAULT now() | |

**인덱스**: `(analysisId)`

**CognitiveErrorType Enum 값**: `confirmation_bias`, `availability_heuristic`, `anchoring`, `black_and_white_thinking`, `overgeneralization`, `emotional_reasoning`, `selective_abstraction`, `catastrophizing`

#### NextAuth.js 관리 테이블 (`Account`, `Session`, `VerificationToken`)
> NextAuth.js v5 Prisma Adapter가 자동 관리. 직접 조작 금지.

---

### 4.3 설계 결정 요약

- **Analysis ↔ Record: 1:1** — 하나의 기록에 분석 결과는 하나. 재분석은 기존 Analysis를 덮어쓴다.
- **CognitiveError 정규화** — 오류 유형별 행 분리로 유형별 통계 쿼리를 단순화 (Post-MVP 시각화 대비).
- **Subscription: User당 1행** — 구독 이력 추적은 Stripe 이벤트 로그에 위임. DB에는 현재 상태만 보관.
- **Free 티어 사용량** — 별도 UsageLog 테이블 없이 `Record`, `Analysis` 테이블을 월별 count 쿼리로 계산 (MVP 단순화).

---

## 5. API 설계

> Base URL: `/api/v1` | 인증: `Authorization: Bearer <session_token>` (NextAuth.js)
> 성공 응답: `{ "data": T, "meta"?: { pagination } }` | 오류 응답: `{ "error": { "code": string, "message": string } }`

### 5.1 Auth — `/api/v1/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | 회원가입 (이메일+비밀번호) | ❌ |
| POST | `/auth/login` | 로그인 | ❌ |
| POST | `/auth/logout` | 로그아웃 (세션 무효화) | ✅ |
| GET | `/auth/me` | 현재 사용자 정보 조회 | ✅ |

**Register Request**
```json
{ "email": "string", "password": "string (min 8자)", "agreedToTerms": true }
```
**Login Response**
```json
{ "userId": "uuid", "email": "string", "onboardingCompleted": true, "subscriptionStatus": "free | premium | expired" }
```

---

### 5.2 Onboarding — `/api/v1/onboarding`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PATCH | `/onboarding/complete` | 온보딩 완료 처리 | ✅ |

---

### 5.3 Records — `/api/v1/records`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/records` | 기록 저장 (+ 분석 자동 시작) | ✅ |
| GET | `/records` | 기록 목록 조회 (page, limit) | ✅ |
| GET | `/records/:recordId` | 단일 기록 상세 조회 | ✅ |
| DELETE | `/records/:recordId` | 기록 삭제 | ✅ |

**POST /records Request**
```json
{ "content": "string (20–500자)", "analyzeNow": true }
```
- `analyzeNow: false` → 저장만, 분석 스킵 (선택적 피드백 비활성화 플로우)

**POST /records Response 201**
```json
{ "recordId": "uuid", "content": "string", "analysisStatus": "pending | skipped", "createdAt": "ISO 8601" }
```

**Error Codes**: `CONTENT_TOO_SHORT` 422 / `CONTENT_TOO_LONG` 422 / `QUOTA_EXCEEDED` 429

---

### 5.4 Analysis — `/api/v1/records/:recordId/analysis`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/records/:recordId/analysis` | 분석 결과 조회 (polling 대상) | ✅ |
| POST | `/records/:recordId/analysis/retry` | 분석 재시도 (failed 상태) | ✅ |

**GET Analysis Response 200 — 완료**
```json
{
  "analysisId": "uuid",
  "recordId": "uuid",
  "status": "completed",
  "cognitiveErrors": [
    {
      "type": "confirmation_bias",
      "label": "확증 편향",
      "excerpt": "기록 내 해당 구절",
      "feedback": "개인화된 개선 피드백 텍스트"
    }
  ],
  "overallFeedback": "종합 피드백 문장",
  "analyzedAt": "ISO 8601"
}
```
**status 값**: `pending` | `completed` | `failed` | `skipped`

**인지 오류 유형 Enum**

| Code | Label |
|------|-------|
| `confirmation_bias` | 확증 편향 |
| `availability_heuristic` | 가용성 편향 |
| `anchoring` | 앵커링 오류 |
| `black_and_white_thinking` | 흑백 논리 |
| `overgeneralization` | 과일반화 |
| `catastrophizing` | 파국화 |

---

### 5.5 에러 코드 전체 목록

| HTTP | Code | 설명 |
|------|------|------|
| 400 | `INVALID_INPUT` | 요청 파라미터 오류 |
| 401 | `UNAUTHENTICATED` | 인증 필요 |
| 403 | `FORBIDDEN` | 권한 없음 (타인 리소스) |
| 404 | `NOT_FOUND` | 리소스 없음 |
| 409 | `EMAIL_ALREADY_EXISTS` | 이메일 중복 |
| 422 | `CONTENT_TOO_SHORT` / `CONTENT_TOO_LONG` | 기록 글자 수 제한 위반 |
| 429 | `RATE_LIMITED` | 단기 요청 과다 |
| 500 | `INTERNAL_ERROR` | 서버 오류 |
| 503 | `AI_SERVICE_UNAVAILABLE` | Anthropic API 불가 |

---

### 5.5 성능 목표

| Endpoint | P50 | P95 |
|----------|-----|-----|
| `POST /records` (저장만) | < 300ms | < 800ms |
| `GET /records/:id/analysis` (polling) | < 100ms | < 300ms |
| AI 분석 처리 (백그라운드) | < 2s | < 5s |

> AI 분석은 `POST /records` 응답 후 백그라운드 처리 → 클라이언트가 `/analysis` polling으로 결과 수신하는 방식을 권장합니다.

---

### 5.6 미결 항목 (TBD)

- `analyzeNow: false` 경로에서 나중에 분석 트리거하는 엔드포인트 필요 여부

---

## 6. Change Log

| Date | Version | Change |
|------|---------|--------|
| 2026-04-15 | v0.1 | STUB 생성 |
| 2026-04-15 | v0.2 | 플랫폼 변경: Mobile → Web Client |
| 2026-04-15 | v1.0 | 기술 스택 전체 확정 (Sprint 0-2 완료) |
| 2026-04-15 | v1.1 | API 설계 섹션 5 전면 작성 (Auth/Records/Analysis/Subscription) |
| 2026-04-15 | v1.2 | 데이터 모델 섹션 4 전면 작성 + prisma/schema.prisma 생성 |
| 2026-04-17 | v1.3 | Subscription 제거, CognitiveError severity/clarityScore 필드 추가, STUB 마커 제거 |
| 2026-10-30 | v2.0 | 모바일 네이티브(Capacitor), RevenueCat 인앱결제(`Subscription`, `PlanTier`), 소셜 로그인(`Account`), 장기 인지 패턴 리포트(`/api/v1/analytics`) 아키텍처 반영 |
