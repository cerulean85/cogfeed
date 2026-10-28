# 🧠 Cogfeed — Personalized Cognitive Feedback Service

> **AI 기반 실시간 인지 오류 분석 및 개인화 피드백 반응형 웹 서비스**
> 
> Cogfeed는 사용자가 일상과 업무 중 기록한 텍스트를 AI가 실시간으로 분석하여 **8가지 주요 인지 오류(Cognitive Error/Bias)**를 진단하고, 사고의 명확성을 높이기 위한 **개인화된 개선 피드백**을 제공하는 프리미엄 웹 서비스입니다.

---

## 🚀 1. 서비스 소개 & 핵심 가치

정신 노동과 고도의 의사결정에 직면하는 현대인(개발자, 마케팅 전문가, 작가 등)은 자신도 모르게 인지적 편향과 사고의 오류에 빠지기 쉽습니다. 한국인 10명 중 9명이 인지적 오류 습관을 지니고 있으나, 이를 스스로 인식하고 교정하기는 매우 어렵습니다.

**Cogfeed**는 이 문제를 해결하기 위해 탄생했습니다.

### 🌟 핵심 가치 제안 (Value Proposition)
* **실시간 자아 성찰 도우미**: 글을 쓰는 간단한 행동만으로 AI가 사고 흐름의 왜곡을 짚어냅니다.
* **심층 패턴 분석**: 단순한 지적을 넘어 장기적인 인지 습관의 개선 방향을 제시합니다.
* **프리미엄 무광고 모델**: 사용자가 생각에 온전히 집중할 수 있도록 광고가 없는 구독 기반 청정 환경을 제공합니다.
* **웹 퍼스트 반응형 UX**: 모바일, 태블릿, 데스크톱 등 어떤 기기에서든 최적화된 화면으로 빠르게 기록할 수 있습니다.

### 👥 타겟 사용자 페르소나 (Target Personas)
| 페르소나 | 주요 과업 (JTBD) | 핵심 페인 포인트 (Pain Point) | 서비스 활용 시나리오 |
| :--- | :--- | :--- | :--- |
| **IT 개발자 김민수 (28M)** | 기술 학습 시 자신의 이해도를 검증하기 위해 블로그 포스트 작성 | 지식 기록 시 논리적 논거 부족, 자기 분석에 1시간 이상 소요 | 기술 글 작성 시 **확증 편향** 및 **선택적 추상화** 검증 |
| **마케팅 전문가 이지영 (35F)** | 정확한 데이터 분석에 기반한 캠페인 의사결정 | 인지적 편향으로 인한 캠페인 지표 오독 및 불안감 | 지표 회고록 작성 시 **가용성 편향** 및 **앵커링 오류** 감지 |
| **프리랜서 작가 박수진 (32F)** | 창의적 글쓰기 중 사고 과정을 투명하고 매끄럽게 정리 | 메시지 전달에 있어 인과관계 왜곡 및 생각의 단절 발생 | 집필 초안 기록 시 **흑백 논리** 및 **과일반화** 교정 |

---

## 🛠️ 2. 핵심 기능 명세 (Phase 1 MVP)

Cogfeed는 검증된 기획 요건에 근거해 높은 우선순위의 4가지 핵심 기능군을 제공합니다.

```
[ 회원 가입 ] ──► [ 온보딩 가이드 ] ──► [ 대시보드 진입 ] ──► [ 생각 기록 작성 ] ──► [ AI 실시간 분석 ] ──► [ 개인화 피드백 확인 ]
```

1. **기록 작성 및 관리 (Record Management)**
   * 20자 이상 500자 이하의 짧은 생각이나 업무 메모를 쉽고 빠르게 기록할 수 있는 미니멀 폼 인터페이스.
   * `analyzeNow` 옵션을 통해 작성 시점의 즉시 분석 요청 여부를 유연하게 선택 가능.
   * 작성된 기록의 생성일자 내림차순 정렬 목록 및 단일 기록 상세 조회/삭제 기능 제공.

2. **AI 실시간 인지 오류 분석 (Cognitive Error Analysis)**
   * 저장 완료된 기록을 백그라운드 AI가 즉각 분석하여 인지적 왜곡 및 편향 진단.
   * 분석 진행도에 따른 로딩 스피너 및 사용자 피드백 상태(Pending, Completed, Failed, Skipped) 처리.
   * 오류 수준에 따른 종합 사고 명확도 점수인 **Clarity Score (0~100점)** 산출.

3. **8가지 인지 오류 유형 진단 (Cognitive Error Types)**
   AI 엔진은 사용자 기록 내 구절(`excerpt`)을 직접 발췌하여 다음 8가지 인지적 왜곡을 정밀 분석합니다:
   * **확증 편향 (Confirmation Bias)**: 자신의 신념에 부합하는 정보만 선택적으로 수용하는 오류.
   * **가용성 편향 (Availability Heuristic)**: 최근이나 쉽게 떠오르는 기억에만 의존해 판단하는 오류.
   * **앵커링 오류 (Anchoring)**: 처음에 제시된 정보나 기준점에 과도하게 얽매이는 오류.
   * **흑백 논리 (Black-and-White Thinking)**: 중간 지대 없이 전부 아니면 전무로 이분법적 판단을 내리는 오류.
   * **과일반화 (Overgeneralization)**: 단 한두 번의 사건을 근거로 전체를 판단하고 규칙화하는 오류.
   * **감정적 추론 (Emotional Reasoning)**: 객관적 사실 대신 자신의 주관적인 감정을 근거로 판단하는 오류.
   * **선택적 추상화 (Selective Abstraction)**: 전체 맥락 중 극히 일부 부정적인 면만 강조하여 결론짓는 오류.
   * **파국화 (Catastrophizing)**: 최악의 파멸적인 결과를 당연하게 상상하고 두려워하는 오류.

4. **개인화 실시간 피드백 (Actionable Feedback)**
   * 진단된 인지 오류에 대하여 해당 구절이 왜곡된 이유를 해설하고, 이를 교정하기 위한 1:1 맞춤형 팁 제공.
   * 오류 심각도(Severity: `low`, `medium`, `high`)에 따른 명확한 시각적 뱃지 표기.
   * 분석 실패 시 재시도(`retry`) 기능 제공.

5. **심리스 온보딩 (Onboarding Journey)**
   * 이메일/비밀번호 기반의 간결한 회원가입 및 필수 약관 동의.
   * 가입 완료 후 핵심 기능 사용법과 가치를 단계별로 인지하도록 돕는 가이드 워크스루.
   * 다크/라이트 모드 테마 및 언어(ko) 환경 설정 지원.

---

## 💻 3. 기술 스택 (Technical Stack)

최첨단의 웹 표준 및 개발 효율을 극대화하기 위해 강력하고 안정적인 모던 스택을 채택했습니다.

| 레이어 | 기술 스택 (Technology) | 버전/상태 | 설명 및 도입 목적 |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | `v16.2.3` | 서버 컴포넌트 최적화, 뛰어난 성능, 유연한 Routing 및 API 처리 |
| **Core Library** | **React** | `v19.2.4` | 최신 훅 및 비동기 트랜잭션, React Server Actions 활용 |
| **Language** | **TypeScript** | `v5` | 엄격한 타입 안정성 확보 및 런타임 오류 방지 |
| **Styling** | **Tailwind CSS v4 + shadcn/ui** | `v4.x` | 유연한 토큰 기반 디자인 시스템 및 높은 접근성의 UI 컴포넌트 |
| **Form Control** | **React Hook Form + Zod** | `v7` / `v4` | 부드러운 폼 인터랙션 및 강력한 클라이언트/서버 스키마 검증 |
| **Database** | **PostgreSQL** | 생산 배포 | 안정적이고 확장성 높은 관계형 데이터베이스 |
| **ORM** | **Prisma ORM** | `v7.7.0` | 타입 안정성이 보장된 스키마 모델링 및 쿼리 빌더 |
| **Authentication**| **NextAuth.js (Auth.js)** | `v5.0.0-beta` | 보안성이 뛰어난 이메일/비밀번호 기반 세션 인증 |
| **AI Engine** | **Anthropic Claude & OpenAI API** | Multi-Provider | `claude-sonnet-4-5` 및 `gpt-4o` 기반 실시간 자연어 분석 추상화 |
| **Monitoring** | **Sentry** | `v10.49.0` | 엣지 및 클라이언트 에러/성능 모니터링 |

---

## 📐 4. 시스템 아키텍처 & 데이터 모델

### 🧱 FSD (Feature-Sliced Design) 아키텍처
본 프로젝트는 확장성과 유지보수 편의성을 극대화하기 위해 **기능 분할 설계(Feature-Sliced Design, FSD)** 패턴을 준수합니다.

```
src/
├── app/               # 애플리케이션의 엔트리포인트, 라우트 정의, 글로벌 레이아웃
├── features/          # 사용자 상호작용 및 비즈니스 액션 (auth, record, subscription)
├── entities/          # 도메인 모델, 비즈니스 엔티티 및 API 연동 데이터 (user, record, analysis)
├── widgets/           # features와 entities를 조합한 결합형 독립 UI 블록 (navigation)
├── shared/            # 범용 컴포넌트, 스타일시트, 유틸리티, 디자인 토큰 (ui, lib, hooks)
└── lib/               # 외부 라이브러리 연동 및 인프라 어댑터 (ai, prisma, auth)
```

### 🗄️ 데이터베이스 ERD (Prisma 스키마 모델)
사용자의 인지 습관 분석 데이터를 정밀하게 영속화하기 위해 최적화된 스키마로 설계되었습니다.

```mermaid
erDiagram
    USER ||--o{ RECORD : "writes"
    RECORD ||--o| ANALYSIS : "has"
    ANALYSIS ||--o{ COGNITIVE_ERROR : "diagnoses"

    USER {
        string id PK
        string email UNIQUE
        string passwordHash
        boolean onboardingCompleted
        string theme
        string locale
        datetime createdAt
        datetime updatedAt
    }

    RECORD {
        string id PK
        string userId FK
        string content
        datetime createdAt
        datetime updatedAt
    }

    ANALYSIS {
        string id PK
        string recordId FK "UNIQUE"
        enum status "pending | completed | failed | skipped"
        text overallFeedback
        int clarityScore
        int retryCount
        datetime analyzedAt
        datetime createdAt
    }

    COGNITIVE_ERROR {
        string id PK
        string analysisId FK
        enum type "confirmation_bias | availability_heuristic | anchoring | ..."
        enum severity "low | medium | high"
        text excerpt
        text feedback
        datetime createdAt
    }
```

---

## 🚀 5. 시작하기 (Getting Started)

### 📋 요구 사항 (Prerequisites)
* Node.js v18 이상 (React 19 및 Next.js 16 지원 버전)
* PostgreSQL 데이터베이스 인스턴스

### ⚙️ 1. 환경 변수 설정
프로젝트 루트 폴더에 `.env` 파일을 생성하고 `.env.example`을 참고하여 알맞은 값을 작성합니다:

```env
# ─── 사이트 URL ───
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ─── AI 프로바이더 설정 ───
AI_PROVIDER=anthropic   # anthropic 또는 openai 선택
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key

# ─── NextAuth 설정 ───
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# ─── Database 설정 ───
DATABASE_URL=postgresql://user:password@localhost:5432/cogfeed
```

### 📦 2. 의존성 패키지 설치
```bash
npm install
```

### 🗃️ 3. 데이터베이스 마이그레이션 및 시드 데이터 주입
Prisma ORM을 사용하여 데이터베이스 스키마를 마이그레이션하고 초기 환경설정 데이터를 주입합니다.

```bash
# Prisma 클라이언트 생성 및 DB 마이그레이션
npx prisma db push

# 기초 데이터 시딩 실행 (SiteConfig 등 초기화)
npm run seed
```

### 💻 4. 개발 서버 실행
```bash
npm run dev
```
브라우저를 열고 `http://localhost:3000`에 접속하여 로컬 개발 환경의 Cogfeed를 경험하세요!

---

## 🎨 6. 디자인 원칙 & 접근성 지침

Cogfeed는 기술적 완성도와 함께 사용자 감성을 터치하는 뛰어난 **비주얼 에스테틱**과 **웹 접근성**을 보장합니다.

### 🎨 프리미엄 디자인 언어 (Visual Aesthetics)
* **다크/라이트 테마 (Theme Integration)**: OS 설정에 동기화되는 미려한 다크 모드 및 라이트 모드 지원.
* **Curated Color Palette**: 단순 원색을 배제하고 고급스러운 감성의 HSL 기반 컬러 팔레트를 `globals.css` `:root` 토큰에 적용.
* **마이크로 인터랙션**: 버튼 호버 시의 자연스러운 스케일 변화, 분석 로딩 상태 시의 부드러운 스켈레톤 및 트랜지션 효과 적용.

### ♿ 웹 접근성 지침 준수 (WCAG 2.1 AA 및 WCAG 2.5.5)
모든 사용자가 차별 없이 도구를 활용하도록 설계되었습니다:
* **포커스 링 & 키보드 탐색**: 마우스 없이 `Tab` 및 `Shift + Tab`으로 모든 양식 조작 가능 (`focus-visible:ring-2` 보장).
* **충분한 터치 타겟**: 클릭 가능한 모든 버튼과 인터랙션 요소는 최소 **44×44px** 이상의 터치 영역을 준수하여 손가락 터치나 정밀하지 않은 포인터 조작을 배려.
* **스크린 리더 완벽 대응**: 모든 컨트롤러에 상세한 `aria-label` 부여 및 오류 상황 시 `role="alert"`를 활용해 즉각 음성 안내.
* **색상 독립적 인지**: 인지 오류 심각도 수준(Low, Medium, High)을 단순히 색상뿐만 아니라 텍스트 뱃지 및 심볼을 통해 동시 명시.

---

## 📂 7. 품질 및 변경 이력 관리

### 📖 System of Record (docs/ 디렉토리)
프로젝트의 모든 요구사항, 기술적 의사 결정 사항 및 아키텍처는 코드 주석이나 메신저 대신 `/docs` 아래의 구조화된 파일들로 기록 및 관리됩니다.
* [ target_prd.md ](file:///Users/zhkim/Desktop/git/cogfeed/docs/target_prd.md): 서비스 상세 기획안 및 RICE 스코어 우선순위.
* [ ux_design_output.md ](file:///Users/zhkim/Desktop/git/cogfeed/docs/ux_design_output.md): 정보 구조도(IA), 상세 사용자 흐름도 및 뷰 사양서.
* [ ARCHITECTURE.md ](file:///Users/zhkim/Desktop/git/cogfeed/docs/ARCHITECTURE.md): 시스템 다이어그램, API 명세서, 성능 목표.
* [ DESIGN.md ](file:///Users/zhkim/Desktop/git/cogfeed/docs/DESIGN.md): 디자인 토큰 정의 및 컴포넌트 구현 원칙.
* [ decisions.md ](file:///Users/zhkim/Desktop/git/cogfeed/docs/decisions.md): 프로젝트 발자취를 추적할 수 있는 기술 의사 결정 ADR 기록.
* [ QUALITY_SCORE.md ](file:///Users/zhkim/Desktop/git/cogfeed/docs/QUALITY_SCORE.md): 코드 품질 자가진단 및 배포 자격 체크리스트.
