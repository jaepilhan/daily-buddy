import type { DailyContent, LevelKey } from "@/types/article";
import { apr22LittleBuddy } from "./apr22-little-buddy";
import { apr22ExplorerBuddy } from "./apr22-explorer-buddy";
import { apr22ProBuddy } from "./apr22-pro-buddy";
import { apr23LittleBuddy } from "./apr23-little-buddy";
import { apr23ExplorerBuddy } from "./apr23-explorer-buddy";
import { apr23ProBuddy } from "./apr23-pro-buddy";

// ─────────────────────────────────────────────────
// LEVEL CONFIG
// ─────────────────────────────────────────────────
export const LEVEL_CONFIG: Record<
  LevelKey,
  { label: string; emoji: string; ages: string }
> = {
  little_buddy: { label: "Little Buddy", emoji: "🟢", ages: "5–7" },
  explorer_buddy: { label: "Explorer Buddy", emoji: "🟡", ages: "8–10" },
  pro_buddy: { label: "Pro Buddy", emoji: "🔴", ages: "11–13" },
};

export const LEVEL_ORDER: LevelKey[] = [
  "little_buddy",
  "explorer_buddy",
  "pro_buddy",
];

// ─────────────────────────────────────────────────
// DATE REGISTRY
// ─────────────────────────────────────────────────
export interface DateEntry {
  dateKey: string;   // used as identifier: 'apr22'
  isoDate: string;   // '2026-04-22'
  label: string;     // 'April 22, 2026'
  dayOfWeek: string; // 'Tuesday'
}

// To add a new date, append an entry here.
export const DATES: DateEntry[] = [
  {
    dateKey: "apr22",
    isoDate: "2026-04-22",
    label: "April 22, 2026",
    dayOfWeek: "Tuesday",
  },
  {
    dateKey: "apr23",
    isoDate: "2026-04-23",
    label: "April 23, 2026",
    dayOfWeek: "Wednesday",
  },
];

// ─────────────────────────────────────────────────
// CONTENT REGISTRY
// ─────────────────────────────────────────────────
// Structure: CONTENT[dateKey][levelKey] = DailyContent | null
// null means the content exists but hasn't been added yet ("Coming Soon").
//
// HOW TO ADD NEW CONTENT:
//   1. Create file:  data/{date}-{level}.ts  (e.g. apr23-little-buddy.ts)
//   2. Import it below (one import line)
//   3. Add the dateKey to DATES above if it's a new date
//   4. Set the value in CONTENT[dateKey][levelKey]
//
// Example:
//   import { apr23LittleBuddy } from "./apr23-little-buddy";
//   CONTENT.apr23 = { little_buddy: apr23LittleBuddy, explorer_buddy: null, pro_buddy: null };

export const CONTENT: Record<
  string,
  Record<LevelKey, DailyContent | null>
> = {
  apr22: {
    little_buddy: apr22LittleBuddy,
    explorer_buddy: apr22ExplorerBuddy,
    pro_buddy: apr22ProBuddy,
  },
  apr23: {
    little_buddy: apr23LittleBuddy,
    explorer_buddy: apr23ExplorerBuddy,
    pro_buddy: apr23ProBuddy,
  },
};

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────
export function getContent(
  dateKey: string,
  level: LevelKey
): DailyContent | null {
  return CONTENT[dateKey]?.[level] ?? null;
}

export function getDateEntry(dateKey: string): DateEntry | undefined {
  return DATES.find((d) => d.dateKey === dateKey);
}
