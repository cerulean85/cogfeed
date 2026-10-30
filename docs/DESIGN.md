# DESIGN.md — 디자인 원칙 & 컴포넌트 가이드

> UX 설계 상세 산출물(IA, 유저 플로우, 화면 컴포넌트)은 [docs/ux_design_output.md](ux_design_output.md)를 참조.
> 이 문서는 전사 디자인 원칙과 토큰 기준을 정의합니다.

---

## 1. UX 4대 설계 원칙

| 원칙 | 정의 | 현재 상태 |
|------|------|---------|
| 직관성 (Intuitiveness) | 초보 사용자도 별도 학습 없이 사용 가능 | ✅ 충족 |
| 효율성 (Efficiency) | 목표 달성까지 최소 Steps, 불필요한 전환 없음 | ✅ 충족 |
| 접근성 (Accessibility) | ARIA label, 44px 터치 영역, 색 외 텍스트 대비 | ⚠️ 부분 충족 (개선 중) |
| 일관성 (Consistency) | 동일 컴포넌트·레이블·인터랙션 전체 통일 | ✅ 충족 |

> Nielsen 10 Heuristics 점검 결과 → [docs/ux_design_output.md](ux_design_output.md) 섹션 5

---

## 2. 레이아웃 기준

- **네비게이션**: 사이드바(데스크톱) / 햄버거 메뉴(모바일 브라우저) — 4개 주요 섹션
- **최대 Depth**: 3 Depth
- **최대 콘텐츠 너비**: 1200px (중앙 정렬)
- **브레이크포인트**: Mobile ≤ 768px / Tablet 769–1024px / Desktop ≥ 1025px
- **좌우 패딩**: Desktop 24px / Mobile 16px
- **섹션 간 간격**: 24px
- **섹션 타이틀 ↔ 컨텐츠**: 12px
- **최소 클릭 영역**: 44×44px (WCAG 2.5.5)
- **기록 추가 CTA**: 페이지 내 고정 버튼 (사이드바 상단 또는 콘텐츠 헤더)

---

## 3. 컴포넌트 원칙

- 화면 당 CTA 1개 원칙 (불필요한 선택지 제거)
- 모든 모달에 닫기/뒤로가기 제공 (사용자 제어 보장)
- 오류 메시지: `role="alert"`, 스크린 리더 즉시 알림
- 로딩 상태: 스피너 + 버튼 비활성화
- 성공 피드백: 토스트 메시지

---

## 4. 디자인 토큰

> shadcn/ui 기반 CSS 변수로 관리. `src/app/globals.css` `:root` 블록이 실제 소스.

### 색상 (Light / Dark)

| 토큰 | Light | Dark | 용도 |
|------|-------|------|------|
| `--background` | oklch(1 0 0) — 흰색 | oklch(0.145 0 0) — 거의 검정 | 페이지 배경 |
| `--foreground` | oklch(0.145 0 0) | oklch(0.985 0 0) | 기본 텍스트 |
| `--primary` | oklch(0.205 0 0) | oklch(0.922 0 0) | CTA 버튼, 액션 |
| `--muted` | oklch(0.97 0 0) | oklch(0.269 0 0) | 서브 배경, 비활성 영역 |
| `--muted-foreground` | oklch(0.556 0 0) | oklch(0.708 0 0) | 보조 텍스트 |
| `--destructive` | oklch(0.577 0.245 27) — 빨강 | oklch(0.704 0.191 22) | 오류, 삭제 액션 |
| `--border` | oklch(0.922 0 0) | oklch(1 0 0 / 10%) | 테두리 |

severity 색상 (인지 오류 뱃지):

| 수준 | 배경 | 텍스트 |
|------|------|--------|
| low | `bg-blue-50` | `text-blue-600` |
| medium | `bg-yellow-50` | `text-yellow-700` |
| high | `bg-red-50` | `text-red-600` |

### 타이포그래피

| 토큰 | 값 |
|------|----|
| `--font-sans` | Pretendard → Noto Sans KR → system-ui |
| `--font-mono` | SFMono-Regular → JetBrains Mono → Menlo |
| heading (h1) | `text-2xl font-bold tracking-tight` |
| body | `text-sm leading-relaxed` |
| caption | `text-xs text-muted-foreground` |

### 스페이싱 & 반경

| 토큰 | 값 |
|------|----|
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| `--radius` (기본) | 0.625rem (10px) |

---

## 5. 접근성 체크리스트

- [ ] 모든 인터랙티브 요소에 ARIA label 명시
- [ ] 색만으로 상태를 전달하지 않음 (텍스트 병행)
- [ ] 키보드 단독 조작 가능 (Tab / Shift+Tab / Enter / Escape)
- [ ] 포커스 순서가 논리적임 (focus ring 표시)
- [ ] 최소 클릭 영역 44×44px 준수 (WCAG 2.5.5)
- [ ] 스크린 리더 우선 읽기 순서 (`h1` 최상단)
- [ ] 반응형 뷰포트 3단계(Mobile/Tablet/Desktop) 정상 렌더링

---

## 6. Change Log

| Date | Version | Change |
|------|---------|--------|
| 2026-04-15 | v0.1 | STUB 생성, UX 산출물 기반 원칙 정리 |
| 2026-04-15 | v0.2 | 플랫폼 변경 반영: Mobile → Web (반응형) |
