# Feature Spec: 소셜 로그인 도입 (Google / Kakao / Apple)

> Priority: Must-have (Phase 2 모바일 온보딩 전환율 개선 & iOS 심사 필수 요건)
> ADR 참조: docs/decisions.md ADR-009

---

## 1. Goal

모바일 앱 환경에서 이메일과 비밀번호를 타이핑하는 번거로움을 없애고, 한국 사용자에게 친숙한 카카오·구글 및 iOS 앱스토어 필수 요건인 Apple 원클릭 로그인을 지원한다.

---

## 2. Acceptance Criteria

- [ ] 로그인(`/login`) 및 회원가입(`/register`) 화면에 **카카오로 계속하기**, **Google로 계속하기**, **Apple로 계속하기** 원클릭 버튼이 제공된다.
- [ ] NextAuth.js v5 OAuth 프로바이더(`Google`, `Kakao`, `Apple`)가 구성되며, 소셜 로그인 최초 진입 시 `User` 및 `Account` 레코드가 자동 생성되고 온보딩 플로우로 연결된다.
- [ ] 모든 소셜 로그인 버튼은 최소 44×44px 터치 타겟, 명확한 `aria-label`, 브랜드 가이드라인 색상을 준수한다.

