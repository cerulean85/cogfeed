/**
 * 임시 인메모리 스토어
 * TODO (Sprint 3): Prisma + PostgreSQL로 교체
 *
 * Next.js dev 서버는 핫리로드 시 초기화될 수 있음 — 개발 전용
 */
import type { Record } from "./types";

// 글로벌 싱글턴 (HMR 대응)
const globalStore = globalThis as typeof globalThis & {
  __records?: Map<string, Record>;
};

if (!globalStore.__records) {
  globalStore.__records = new Map();
}

export const recordStore = globalStore.__records;
