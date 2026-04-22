import type { Language } from "./calculator";

export interface TypingRecord {
  levelId: string;
  language: Language;
  wpm: number;       // WPM for English, KPM for Korean
  accuracy: number;
  durationMs: number;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  createdAt: number;
}

const USERS_KEY = "typing_users";
const ACTIVE_USER_KEY = "typing_active_user";
const RECORDS_PREFIX = "typing_records_";
const SOUND_KEY = "typing_sound";
const LANG_KEY = "typing_ui_lang";

// ── Users ──────────────────────────────────────────────────────────────────

export function getUsers(): UserProfile[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addUser(name: string): UserProfile {
  const users = getUsers();
  const user: UserProfile = { name, createdAt: Date.now() };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setActiveUser(name);
  return user;
}

export function getActiveUser(): string | null {
  return localStorage.getItem(ACTIVE_USER_KEY);
}

export function setActiveUser(name: string) {
  localStorage.setItem(ACTIVE_USER_KEY, name);
}

// ── Records ────────────────────────────────────────────────────────────────

function recordsKey(userName: string): string {
  return `${RECORDS_PREFIX}${userName}`;
}

export function getRecords(userName: string): TypingRecord[] {
  try {
    return JSON.parse(localStorage.getItem(recordsKey(userName)) ?? "[]");
  } catch {
    return [];
  }
}

export function saveRecord(userName: string, record: TypingRecord): boolean {
  const records = getRecords(userName);
  // Check personal best BEFORE adding new record
  const prevBest = records
    .filter((r) => r.levelId === record.levelId && r.language === record.language)
    .reduce((a, b) => (a.wpm > b.wpm ? a : b), { wpm: 0 } as TypingRecord);
  const isNewRecord = record.wpm > (prevBest?.wpm ?? 0);

  records.push(record);
  if (records.length > 200) records.splice(0, records.length - 200);
  localStorage.setItem(recordsKey(userName), JSON.stringify(records));
  return isNewRecord;
}

export function getPersonalBest(
  userName: string,
  levelId: string,
  language: Language
): TypingRecord | null {
  const records = getRecords(userName).filter(
    (r) => r.levelId === levelId && r.language === language
  );
  if (records.length === 0) return null;
  return records.reduce((a, b) => (a.wpm > b.wpm ? a : b));
}

export function getRecentRecords(userName: string, n = 10): TypingRecord[] {
  const records = getRecords(userName);
  return records.slice(-n).reverse();
}

// ── Preferences ────────────────────────────────────────────────────────────

export function getSoundEnabled(): boolean {
  const val = localStorage.getItem(SOUND_KEY);
  return val === null ? true : val === "true";
}

export function setSoundEnabled(v: boolean) {
  localStorage.setItem(SOUND_KEY, String(v));
}

export function getUILang(): "en" | "ko" {
  return (localStorage.getItem(LANG_KEY) as "en" | "ko") ?? "en";
}

export function setUILang(lang: "en" | "ko") {
  localStorage.setItem(LANG_KEY, lang);
}
