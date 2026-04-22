"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import TypingArea, { type TypingResult } from "../components/TypingArea";
import ResultCard from "../components/ResultCard";
import { KOREAN_LEVELS, generateText, type AgeTier } from "../data/korean";
import {
  getActiveUser, getPersonalBest, saveRecord, getSoundEnabled, setSoundEnabled,
  getUILang, setUILang, type TypingRecord,
} from "../lib/storage";

const TIER_LABELS: Record<AgeTier, { label: string; ages: string }> = {
  little:   { label: "🟢 리틀 버디",  ages: "5–7" },
  explorer: { label: "🟡 탐험 버디",  ages: "8–10" },
  pro:      { label: "🔴 프로 버디",  ages: "11–13" },
};

const WORD_COUNTS: Record<AgeTier, number> = { little: 18, explorer: 22, pro: 25 };

export default function KoreanTypingPage() {
  const [tier, setTier] = useState<AgeTier>("explorer");
  const [levelIdx, setLevelIdx] = useState(0);
  const [exerciseText, setExerciseText] = useState("");
  const [result, setResult] = useState<TypingResult | null>(null);
  const [prevBest, setPrevBest] = useState<TypingRecord | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [sound, setSound] = useState(true);
  const [uiLang, setUILangState] = useState<"en" | "ko">("ko");
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [exerciseKey, setExerciseKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    setUser(getActiveUser());
    setSound(getSoundEnabled());
    setUILangState(getUILang());
  }, []);

  const levelId = KOREAN_LEVELS[levelIdx].id;

  const newExercise = useCallback((lId: string, t: AgeTier) => {
    const pool = KOREAN_LEVELS.find((l) => l.id === lId) ?? KOREAN_LEVELS[0];
    setExerciseText(generateText(pool, t, WORD_COUNTS[t]));
    setResult(null);
    setExerciseKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (mounted) newExercise(KOREAN_LEVELS[0].id, "explorer");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const handleComplete = useCallback((r: TypingResult) => {
    setResult(r);
    if (!user) return;
    const record: TypingRecord = {
      levelId,
      language: "korean",
      wpm: r.wpm,
      accuracy: r.accuracy,
      durationMs: r.durationMs,
      timestamp: Date.now(),
    };
    setPrevBest(getPersonalBest(user, levelId, "korean"));
    setIsNewRecord(saveRecord(user, record));
  }, [user, levelId]);

  const handleTierChange = (t: AgeTier) => { setTier(t); newExercise(levelId, t); };
  const handleLevelChange = (idx: number) => {
    setLevelIdx(idx);
    newExercise(KOREAN_LEVELS[idx].id, tier);
  };
  const handleRetry = () => newExercise(levelId, tier);
  const handleNextLevel = () => {
    const next = Math.min(levelIdx + 1, KOREAN_LEVELS.length - 1);
    setLevelIdx(next);
    newExercise(KOREAN_LEVELS[next].id, tier);
  };
  const toggleSound = () => { const n = !sound; setSound(n); setSoundEnabled(n); };
  const toggleLang = () => { const n = uiLang === "en" ? "ko" : "en"; setUILangState(n); setUILang(n); };

  if (!mounted || !exerciseText) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/typing" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🐻</span>
            <span className="font-black text-gray-900 text-lg">Daily Buddy</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/typing/game?lang=korean" className="text-xs font-black bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full hover:bg-yellow-200 transition-colors">
              🎮 단어 비
            </Link>
            <button onClick={toggleLang} className="text-xs font-black bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
              {uiLang === "en" ? "한국어" : "English"}
            </button>
            <button onClick={toggleSound} className="text-xs font-black bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
              {sound ? "🔊" : "🔇"}
            </button>
            <Link href="/read" className="text-xs font-black text-gray-400 hover:text-gray-700 transition-colors px-2">📰</Link>
          </div>
        </div>
        <div className="bg-red-500 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <span className="text-white font-black">⌨️ 한국어 타자</span>
            <div className="flex gap-1">
              {(Object.entries(TIER_LABELS) as [AgeTier, { label: string; ages: string }][]).map(([t, cfg]) => (
                <button key={t} onClick={() => handleTierChange(t)}
                  className={`px-3 py-1 rounded-full text-xs font-black transition-all ${tier === t ? "bg-white text-red-600 shadow-sm" : "text-white/80 hover:text-white"}`}>
                  {cfg.label} <span className="opacity-70">{cfg.ages}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {KOREAN_LEVELS.map((lv, idx) => (
            <button key={lv.id} onClick={() => handleLevelChange(idx)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all border ${idx === levelIdx ? "bg-red-500 text-white border-red-600 shadow-md scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-red-300"}`}>
              {lv.label}
              <span className="block text-[10px] opacity-70 font-semibold">{lv.sublabel}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-black text-gray-800 text-lg">{KOREAN_LEVELS[levelIdx].label}</h2>
            <p className="text-sm font-bold text-gray-400">{KOREAN_LEVELS[levelIdx].sublabel}</p>
          </div>
          <button onClick={() => setShowKeyboard(!showKeyboard)}
            className={`px-4 py-1.5 rounded-full text-xs font-black border transition-all ${showKeyboard ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
            ⌨️ 키보드 {showKeyboard ? "ON" : "OFF"}
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 mb-4 text-xs font-bold text-yellow-700">
          💡 {uiLang === "en" ? "두벌식 layout. Speed measured in keystrokes (타수)." : "두벌식 표준 자판 · 속도는 자모 단위 타수로 측정됩니다"}
        </div>

        {result ? (
          <ResultCard
            result={{ levelId, language: "korean", wpm: result.wpm, accuracy: result.accuracy, durationMs: result.durationMs, timestamp: Date.now() }}
            prevBest={prevBest}
            isNewRecord={isNewRecord}
            language="korean"
            onRetry={handleRetry}
            onNextLevel={handleNextLevel}
            uiLang={uiLang}
          />
        ) : (
          <TypingArea key={exerciseKey} text={exerciseText} language="korean"
            tier={tier} showKeyboard={showKeyboard} uiLang={uiLang} onComplete={handleComplete} />
        )}

        {user && (
          <p className="text-center text-xs font-bold text-gray-400 mt-6">
            👤 {user} · <Link href="/typing/stats" className="text-red-500 hover:underline">
              {uiLang === "en" ? "View Records" : "기록 보기"}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
