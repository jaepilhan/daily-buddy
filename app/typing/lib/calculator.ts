export type Language = "english" | "korean";

/**
 * WPM: standard (chars typed / 5) / minutes
 * KPM: Korean uses jamo (keystrokes) per minute — 타수
 */
export function calcWPM(charsTyped: number, elapsedMs: number): number {
  if (elapsedMs < 500) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round(charsTyped / 5 / minutes);
}

export function calcKPM(jamoCount: number, elapsedMs: number): number {
  if (elapsedMs < 500) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round(jamoCount / minutes);
}

export function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

export function formatTime(ms: number): string {
  const totalSecs = Math.floor(ms / 1000);
  const m = Math.floor(totalSecs / 60).toString().padStart(2, "0");
  const s = (totalSecs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * Count jamo keystrokes in a Korean string.
 * Each syllable block is decomposed: consonant(s) + vowel(s).
 * This approximates the number of key presses on a 두벌식 keyboard.
 */
export function countJamo(text: string): number {
  let count = 0;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      // Composed syllable: decompose into initial + vowel + (optional final)
      const offset = code - 0xac00;
      const hasJongseong = offset % 28 !== 0;
      count += hasJongseong ? 3 : 2;
    } else if ((code >= 0x3131 && code <= 0x314e) || (code >= 0x314f && code <= 0x3163)) {
      // Standalone jamo
      count += 1;
    } else if (ch !== " ") {
      count += 1;
    }
  }
  return count;
}
