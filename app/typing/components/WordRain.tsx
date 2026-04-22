"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Language } from "../lib/calculator";
import { countJamo } from "../lib/calculator";
import { useSound } from "./useSound";

interface FallingWord {
  id: number;
  word: string;
  x: number;   // % 0–83
  y: number;   // px from top
  speed: number; // px/s
}

interface Props {
  words: string[];
  language: Language;
  uiLang: "en" | "ko";
  onGameOver: (score: number, wordsTyped: number) => void;
}

const GAME_H = 920;
const GAME_W_CLASS = "max-w-6xl";
const LIVES = 20;
const SPAWN_START_MS = 4000;
const SPAWN_MIN_MS = 600;
const SPEED_START = 55;
const SPEED_MAX = 240;

// Progressive difficulty thresholds (ms)
const PHASE2_MS = 30000;  // 30s: 2 concurrent, medium words
const PHASE3_MS = 65000;  // 65s: 3 concurrent, hard words

let _nextId = 1;

// ── Word difficulty ───────────────────────────────────────────────────────────
function wordDiff(word: string, lang: Language): number {
  if (lang === "korean") {
    let hard = 0;
    for (const ch of word) {
      const code = ch.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3 && (code - 0xac00) % 28 !== 0) hard++;
    }
    return hard;
  }
  return word.length;
}

function splitBuckets(words: string[], lang: Language) {
  const sorted = [...words].sort((a, b) => wordDiff(a, lang) - wordDiff(b, lang));
  const t = Math.floor(sorted.length / 3);
  return {
    easy: sorted.slice(0, t || 1),
    med: sorted.slice(t, t * 2 || 2),
    hard: sorted.slice(t * 2),
  };
}

function pickFrom(bag: string[], idxRef: { current: number }): string {
  if (idxRef.current >= bag.length) {
    bag.sort(() => Math.random() - 0.5);
    idxRef.current = 0;
  }
  return bag[idxRef.current++];
}

function getMaxConcurrent(elapsed: number) {
  if (elapsed < PHASE2_MS) return 1;
  if (elapsed < PHASE3_MS) return 2;
  return 3;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function WordRain({ words, language, uiLang, onGameOver }: Props) {
  const [falling, setFalling] = useState<FallingWord[]>([]);
  const [typed, setTyped] = useState("");
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [flashId, setFlashId] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [composing, setComposing] = useState("");

  // All mutable game state in refs so the RAF loop never sees stale closures
  const fallingRef = useRef<FallingWord[]>([]);
  const typedRef = useRef("");
  const livesRef = useRef(LIVES);
  const scoreRef = useRef(0);
  const wordsTypedRef = useRef(0);
  const elapsedRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const lastTsRef = useRef(0);
  const startedRef = useRef(false);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  // Word difficulty buckets
  const easyBagRef = useRef<string[]>([]);
  const medBagRef = useRef<string[]>([]);
  const hardBagRef = useRef<string[]>([]);
  const easyIdxRef = useRef(0);
  const medIdxRef = useRef(0);
  const hardIdxRef = useRef(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number | null>(null);

  const { playClick, playWrong, playComplete, resume, startBgMusic, stopBgMusic } = useSound();
  const stopBgMusicRef = useRef(stopBgMusic);
  stopBgMusicRef.current = stopBgMusic;

  // Pick next word based on current elapsed difficulty phase
  const getNextWord = useCallback(() => {
    const elapsed = elapsedRef.current;
    if (elapsed < PHASE2_MS) {
      return pickFrom(easyBagRef.current, easyIdxRef);
    }
    if (elapsed < PHASE3_MS) {
      return Math.random() < 0.65
        ? pickFrom(easyBagRef.current, easyIdxRef)
        : pickFrom(medBagRef.current, medIdxRef);
    }
    const r = Math.random();
    if (r < 0.25) return pickFrom(easyBagRef.current, easyIdxRef);
    if (r < 0.65) return pickFrom(medBagRef.current, medIdxRef);
    return pickFrom(hardBagRef.current, hardIdxRef);
  }, []);

  // ── Game loop (uses only refs, never stale) ───────────────────────────────
  const gameLoop = useCallback((ts: number) => {
    if (!startedRef.current) return;

    if (lastTsRef.current === 0) lastTsRef.current = ts;
    const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
    lastTsRef.current = ts;
    elapsedRef.current += dt * 1000;

    const elapsed = elapsedRef.current;
    const spawnInterval = Math.max(SPAWN_MIN_MS, SPAWN_START_MS - elapsed / 20);
    const maxConcurrent = getMaxConcurrent(elapsed);
    const speed = Math.min(SPEED_START + elapsed / 300, SPEED_MAX);

    spawnTimerRef.current += dt * 1000;
    if (spawnTimerRef.current >= spawnInterval) {
      spawnTimerRef.current = 0;
      if (fallingRef.current.length < maxConcurrent) {
        const word = getNextWord();
        const newWord: FallingWord = {
          id: _nextId++,
          word,
          x: Math.floor(Math.random() * 83),
          y: -32,
          speed,
        };
        fallingRef.current = [...fallingRef.current, newWord];
      }
    }

    // Move & detect bottom
    let lostLife = false;
    const survived: FallingWord[] = [];
    for (const w of fallingRef.current) {
      const newY = w.y + w.speed * dt;
      if (newY > GAME_H) {
        livesRef.current -= 1;
        lostLife = true;
      } else {
        survived.push({ ...w, y: newY });
      }
    }
    fallingRef.current = survived;

    setFalling([...fallingRef.current]);
    if (lostLife) setLives(livesRef.current);

    if (livesRef.current <= 0) {
      startedRef.current = false;
      setStarted(false);
      stopBgMusicRef.current();
      playComplete();
      onGameOverRef.current(scoreRef.current, wordsTypedRef.current);
      return;
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [getNextWord, playComplete]);

  // Start RAF when started→true
  useEffect(() => {
    if (!started) return;
    lastTsRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, gameLoop]);

  // ── Start / stop ──────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    resume();
    _nextId = 1;
    fallingRef.current = [];
    typedRef.current = "";
    livesRef.current = LIVES;
    scoreRef.current = 0;
    wordsTypedRef.current = 0;
    elapsedRef.current = 0;
    spawnTimerRef.current = 0;
    lastTsRef.current = 0;

    const buckets = splitBuckets(words, language);
    easyBagRef.current = buckets.easy.sort(() => Math.random() - 0.5);
    medBagRef.current = buckets.med.sort(() => Math.random() - 0.5);
    hardBagRef.current = buckets.hard.sort(() => Math.random() - 0.5);
    easyIdxRef.current = 0;
    medIdxRef.current = 0;
    hardIdxRef.current = 0;

    setFalling([]);
    setTyped("");
    setComposing("");
    setLives(LIVES);
    setScore(0);
    setWordsTyped(0);
    setFlashId(null);
    startedRef.current = true;
    setStarted(true);
    startBgMusic();
    inputRef.current?.focus();
  }, [words, language, gameLoop, resume, startBgMusic]);

  const stopGame = useCallback(() => {
    startedRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setStarted(false);
    stopBgMusicRef.current();
    onGameOverRef.current(scoreRef.current, wordsTypedRef.current);
  }, []);

  // ── Typo penalty ──────────────────────────────────────────────────────────
  const penalizeTypo = useCallback(() => {
    if (fallingRef.current.length === 0) return; // no words = no penalty
    playWrong();
    livesRef.current -= 1;
    setLives(livesRef.current);
    typedRef.current = "";
    setTyped("");
    setComposing("");
    if (inputRef.current) inputRef.current.value = "";
    if (livesRef.current <= 0) {
      startedRef.current = false;
      setStarted(false);
      stopBgMusicRef.current();
      playComplete();
      onGameOverRef.current(scoreRef.current, wordsTypedRef.current);
    }
  }, [playWrong, playComplete]);

  // ── Word match ────────────────────────────────────────────────────────────
  const checkMatch = useCallback((current: string) => {
    const match = fallingRef.current.find((w) => w.word === current);
    if (!match) return false;

    playClick();
    setFlashId(match.id);
    setTimeout(() => setFlashId(null), 280);

    fallingRef.current = fallingRef.current.filter((w) => w.id !== match.id);
    setFalling([...fallingRef.current]);

    const pts = language === "english"
      ? match.word.length * 10
      : countJamo(match.word) * 10;
    scoreRef.current += pts;
    wordsTypedRef.current += 1;
    setScore(scoreRef.current);
    setWordsTyped(wordsTypedRef.current);

    typedRef.current = "";
    setTyped("");
    setComposing("");
    if (inputRef.current) inputRef.current.value = "";
    return true;
  }, [language, playClick]);

  // ── English keydown ───────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (language === "korean") return;
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = typedRef.current.slice(0, -1);
      typedRef.current = next;
      setTyped(next);
      return;
    }
    if (e.key.length !== 1) return;
    e.preventDefault();
    const next = typedRef.current + e.key;
    typedRef.current = next;
    setTyped(next);
    if (!checkMatch(next)) {
      const anyStart = fallingRef.current.some((w) => w.word.startsWith(next));
      if (!anyStart && next.length > 0) penalizeTypo();
    }
  }, [language, checkMatch, penalizeTypo]);

  // ── Korean IME ────────────────────────────────────────────────────────────
  const handleCompositionUpdate = useCallback((e: React.CompositionEvent) => {
    setComposing(e.data ?? "");
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent) => {
    setComposing("");
    const committed = e.data;
    if (!committed) return;
    const next = typedRef.current + committed;
    typedRef.current = next;
    setTyped(next);
    if (!checkMatch(next)) {
      const anyStart = fallingRef.current.some((w) => w.word.startsWith(next));
      if (!anyStart && next.length > 0) penalizeTypo();
    }
    if (inputRef.current) inputRef.current.value = "";
  }, [checkMatch, penalizeTypo]);

  const handleKoreanKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = typedRef.current.slice(0, -1);
      typedRef.current = next;
      setTyped(next);
    }
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  const livePct = (lives / LIVES) * 100;
  const liveColor = livePct > 60 ? "bg-green-400" : livePct > 30 ? "bg-yellow-400" : "bg-red-500";

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* HUD */}
      <div className={`flex gap-4 text-center w-full ${GAME_W_CLASS}`}>
        <div className="flex-1 bg-white rounded-2xl py-2 shadow-sm border border-gray-100">
          <p className="text-xl font-black text-yellow-500">{score}</p>
          <p className="text-xs font-bold text-gray-400">{uiLang === "en" ? "Score" : "점수"}</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl py-2 shadow-sm border border-gray-100">
          <p className="text-xl font-black text-green-600">{wordsTyped}</p>
          <p className="text-xs font-bold text-gray-400">{uiLang === "en" ? "Words" : "단어"}</p>
        </div>
        {/* Lives bar */}
        <div className="flex-[2] bg-white rounded-2xl py-2 px-4 shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">❤️</span>
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${liveColor}`}
                style={{ width: `${livePct}%` }}
              />
            </div>
            <span className="text-sm font-black text-gray-700 w-10 text-right">{lives}<span className="text-gray-400 font-bold">/{LIVES}</span></span>
          </div>
          <p className="text-xs font-bold text-gray-400 mt-0.5">{uiLang === "en" ? "Lives" : "목숨"}</p>
        </div>
      </div>

      {/* Game area */}
      <div
        className={`relative w-full ${GAME_W_CLASS} rounded-2xl overflow-hidden border-2 border-gray-700 bg-gradient-to-b from-indigo-950 to-slate-900`}
        style={{ height: GAME_H }}
        onClick={() => started && inputRef.current?.focus()}
      >
        {/* Start overlay */}
        {!started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-black/60">
            <span className="text-6xl">🌧️</span>
            <h2 className="text-2xl font-black text-white">
              {uiLang === "en" ? "Word Rain" : "단어 비"}
            </h2>
            <p className="text-sm font-bold text-white/60 text-center px-8">
              {uiLang === "en"
                ? "Type the falling words before they hit the ground!"
                : "단어가 바닥에 닿기 전에 타이핑하세요!"}
            </p>
            <div className="text-xs font-bold text-white/40 text-center space-y-1">
              <p>{uiLang === "en" ? "🟢 Starts slow · 1 word at a time" : "🟢 처음엔 천천히 · 단어 1개씩"}</p>
              <p>{uiLang === "en" ? "🔴 Gets faster · more words · harder vocab" : "🔴 점점 빠르고 · 단어 많아지고 · 어려워짐"}</p>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black rounded-2xl text-lg transition-all hover:scale-105 shadow-lg"
            >
              {uiLang === "en" ? "▶ Start!" : "▶ 시작!"}
            </button>
          </div>
        )}

        {/* Falling words */}
        {falling.map((w) => {
          const isActive = typedRef.current.length > 0 && w.word.startsWith(typedRef.current);
          const isFlash = flashId === w.id;
          return (
            <div
              key={w.id}
              className={`absolute font-black text-sm px-3 py-1 rounded-full pointer-events-none ${
                isFlash
                  ? "bg-yellow-400 text-gray-900 opacity-0 scale-150"
                  : isActive
                    ? "bg-emerald-400 text-white shadow-lg shadow-emerald-400/40"
                    : "bg-white/10 text-white border border-white/20"
              }`}
              style={{
                left: `${w.x}%`,
                top: w.y,
                transition: isFlash ? "opacity 0.25s, transform 0.25s" : "none",
              }}
            >
              {isActive ? (
                <>
                  <span className="text-yellow-200">{w.word.slice(0, typedRef.current.length)}</span>
                  <span>{w.word.slice(typedRef.current.length)}</span>
                </>
              ) : w.word}
            </div>
          );
        })}

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500/50" />

        {/* Star dots */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ background: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px), radial-gradient(circle at 50% 15%, white 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      {/* Input row */}
      <div className={`w-full ${GAME_W_CLASS} flex gap-3`}>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            className={`w-full border-2 rounded-xl px-4 py-3 font-black text-lg text-gray-800 focus:outline-none bg-white ${
              started ? "border-yellow-300 focus:border-yellow-500" : "border-gray-200 bg-gray-50"
            }`}
            placeholder={
              started
                ? (uiLang === "en" ? "Type here…" : "여기에 입력…")
                : (uiLang === "en" ? "Press Start to play" : "시작 버튼을 누르세요")
            }
            disabled={!started}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onKeyDown={language === "english" ? handleKeyDown : handleKoreanKeyDown}
            onCompositionUpdate={handleCompositionUpdate}
            onCompositionEnd={handleCompositionEnd}
          />
          {started && (typed || composing) && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none font-black text-lg">
              <span className="text-gray-800">{typed}</span>
              <span className="text-blue-400">{composing}</span>
            </div>
          )}
        </div>
        {started && (
          <button
            onClick={stopGame}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-black rounded-xl text-sm transition-colors"
          >
            {uiLang === "en" ? "■ Stop" : "■ 종료"}
          </button>
        )}
      </div>
    </div>
  );
}
