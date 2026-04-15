import type { Session, User } from "./types";

const globalStore = globalThis as typeof globalThis & {
  __users?: Map<string, User>;
  __usersByEmail?: Map<string, string>;
  __sessions?: Map<string, Session>;
};

if (!globalStore.__users) {
  globalStore.__users = new Map();
}

if (!globalStore.__usersByEmail) {
  globalStore.__usersByEmail = new Map();
}

if (!globalStore.__sessions) {
  globalStore.__sessions = new Map();
}

export const userStore = globalStore.__users;
export const userEmailIndex = globalStore.__usersByEmail;
export const sessionStore = globalStore.__sessions;
