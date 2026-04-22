"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import WordRain from "../components/WordRain";
import { getGameWords as getEnGameWords, type AgeTier } from "../data/english";
import { getGameWords as getKoGameWords } from "../data/korean";
import { getActiveUser, getSoundEnabled, setSoundEnabled, getUILang, setUILang } from "../lib/storage";

type Language = "english" | "korean";

const TIER_LABELS: Record<AgeTier, { en: string; ko: string; ages: string }> = {
  little:   { en: "🟢 Little Buddy",   ko: "🟢 리틀 버디",  ages: "5–7" },
  explorer: { en: "🟡 Explorer Buddy", ko: "🟡 탐험 버디",  ages: "8–10" },
  pro:      { en: "🔴 Pro Buddy",      ko: "🔴 프로 버디",  ages: "11–13" },
};

interface GameResult {
  score: number;
  wordsTyped: number;
}

function GameContent() {
  const params = useSearchParams();
  const [lang, setLang] = useState<Language>((params.get("lang") as Language) ?? "english");
  const [tier, setTier] = useState<AgeTier>("explorer");
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [gameKey, setGameKey] = useState(0);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [sound, setSound] = useState(true);
  const [uiLang, setUILangState] = useState<"en" | "ko">("en");
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getActiveUser());
    setSound(getSoundEnabled());
    setUILangState(getUILang());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const words = lang === "english" ? getEnGameWords(tier) : getKoGameWords(tier);
    setGameWords(words.sort(() => Math.random() - 0.5));
  }, [lang, tier, mounted]);

  const handleGameOver = (score: number, wordsTyped: number) => {
    setLastResult({ score, wordsTyped });
  };

  const restart = () => {
    const words = lang === "english" ? getEnGameWords(tier) : getKoGameWords(tier);
    setGameWords(words.sort(() => Math.random() - 0.5));
    setLastResult(null);
    setGameKey((k) => k + 1);
  };

  const toggleSound = () => { const n = !sound; setSound(n); setSoundEnabled(n); };
  const toggleUILang = () => { const n = uiLang === "en" ? "ko" : "en"; setUILangState(n); setUILang(n); };

  if (!mounted) return null;

  const tl = (en: string, ko: string) => uiLang === "en" ? en : ko;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950">
      {/* Nav */}
      <div className="sticky top-0 z-20 bg-black/40 backdrop-blur border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/typing" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🐻</span>
            <span className="font-black text-white text-lg">Daily Buddy</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/typing/english" className="text-xs font-black text-white/60 hover:text-white transition-colors px-2">⌨️ Practice</Link>
            <button onClick={toggleUILang} className="text-xs font-black bg-white/10 text-white/80 px-3 py-1.5 rounded-full hover:bg-white/20">
              {uiLang === "en" ? "한국어" : "English"}
            </button>
            <button onClick={toggleSound} className="text-xs font-black bg-white/10 text-white/80 px-3 py-1.5 rounded-full hover:bg-white/20">
              {sound ? "🔊" : "🔇"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-white mb-1">
            🌧️ {tl("Word Rain", "단어 비")}
          </h1>
          <p className="text-sm font-bold text-white/50">
            {tl("Type the words before they fall!", "단어가 바닥에 닿기 전에 타이핑하세요!")}
          </p>
          {user && <p className="text-xs text-white/30 mt-1">👤 {user}</p>}
        </div>

        {/* Settings bar */}
        <div className="flex gap-3 mb-6 flex-wrap justify-center">
          {/* Language toggle */}
          <div className="flex bg-white/10 rounded-xl p-1 gap-1">
            {(["english", "korean"] as Language[]).map((l) => (
              <button key={l} onClick={() => { setLang(l); setLastResult(null); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-black transition-all ${lang === l ? "bg-white text-gray-900" : "text-white/60 hover:text-white"}`}>
                {l === "english" ? "🇺🇸 English" : "🇰🇷 한국어"}
              </button>
            ))}
          </div>
          {/* Tier */}
          <div className="flex bg-white/10 rounded-xl p-1 gap-1">
            {(Object.entries(TIER_LABELS) as [AgeTier, typeof TIER_LABELS.little][]).map(([t, cfg]) => (
              <button key={t} onClick={() => { setTier(t); setLastResult(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tier === t ? "bg-white text-gray-900" : "text-white/60 hover:text-white"}`}>
                {uiLang === "en" ? cfg.en : cfg.ko}
              </button>
            ))}
          </div>
        </div>

        {/* Result overlay */}
        {lastResult ? (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-10 border border-white/20 max-w-sm mx-auto">
              <div className="text-5xl mb-4">🎮</div>
              <h2 className="text-2xl font-black text-white mb-6">
                {tl("Game Over!", "게임 오버!")}
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-3xl font-black text-yellow-400">{lastResult.score}</p>
                  <p className="text-xs font-bold text-white/50">{tl("Score", "점수")}</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-3xl font-black text-green-400">{lastResult.wordsTyped}</p>
                  <p className="text-xs font-bold text-white/50">{tl("Words", "단어")}</p>
                </div>
              </div>
              <button onClick={restart}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black rounded-2xl text-lg transition-all hover:scale-105">
                {tl("Play Again!", "다시 하기!")}
              </button>
            </div>
          </div>
        ) : gameWords.length > 0 ? (
          <WordRain
            key={gameKey}
            words={gameWords}
            language={lang}
            uiLang={uiLang}
            onGameOver={handleGameOver}
          />
        ) : null}
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense>
      <GameContent />
    </Suspense>
  );
}
