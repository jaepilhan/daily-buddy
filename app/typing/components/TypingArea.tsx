"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  calcAccuracy, calcKPM, calcWPM, countJamo, formatTime, type Language,
} from "../lib/calculator";
import VirtualKeyboard from "./VirtualKeyboard";
import { useSound } from "./useSound";

export interface TypingResult {
  wpm: number;
  accuracy: number;
  durationMs: number;
  language: Language;
}

interface Props {
  text: string;
  language: Language;
  tier: string;
  showKeyboard: boolean;
  uiLang: "en" | "ko";
  onComplete: (result: TypingResult) => void;
}

const FONT_SIZE: Record<string, string> = {
  little: "text-2xl",
  explorer: "text-xl",
  pro: "text-lg",
};

export default function TypingArea({ text, language, tier, showKeyboard, uiLang, onComplete }: Props) {
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [wrongIdx, setWrongIdx] = useState<number | null>(null);
  const [composingInput, setComposingInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jamoCountRef = useRef(0);
  const totalKeysRef = useRef(0);
  const wrongCountRef = useRef(0);
  // Refs so handlers always see latest values without stale closures
  const startTimeRef = useRef<number | null>(null);
  const typedRef = useRef("");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const { playClick, playWrong, playComplete, resume } = useSound();

  const elapsedMs = startTime ? now - startTime : 0;
  const speed = language === "english"
    ? calcWPM(typed.length, elapsedMs)
    : calcKPM(jamoCountRef.current, elapsedMs);
  const accuracy = calcAccuracy(
    totalKeysRef.current - wrongCountRef.current,
    totalKeysRef.current
  );

  useEffect(() => {
    setTyped("");
    typedRef.current = "";
    setStartTime(null);
    startTimeRef.current = null;
    setNow(Date.now());
    setWrongIdx(null);
    setComposingInput("");
    jamoCountRef.current = 0;
    totalKeysRef.current = 0;
    wrongCountRef.current = 0;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    inputRef.current?.focus();
  }, [text]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    const start = Date.now();
    startTimeRef.current = start;
    setStartTime(start);
    timerRef.current = setInterval(() => setNow(Date.now()), 250);
  }, []);

  // finish always reads from refs to avoid stale closures
  const finish = useCallback((finalTyped: string) => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    const t0 = startTimeRef.current ?? Date.now();
    const duration = Date.now() - t0;
    const finalSpeed = language === "english"
      ? calcWPM(finalTyped.length, duration)
      : calcKPM(jamoCountRef.current || countJamo(finalTyped), duration);
    const finalAcc = calcAccuracy(
      totalKeysRef.current - wrongCountRef.current,
      totalKeysRef.current
    );
    playComplete();
    setTimeout(() => {
      onCompleteRef.current({ wpm: finalSpeed, accuracy: finalAcc, durationMs: duration, language });
    }, 400);
  }, [language, playComplete]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    resume();
    if (e.key === "Backspace" || e.key.length !== 1) return;
    e.preventDefault();
    startTimer();

    const pos = typedRef.current.length;
    if (pos >= text.length) return;
    totalKeysRef.current += 1;

    if (e.key === text[pos]) {
      playClick();
      setWrongIdx(null);
      const next = typedRef.current + e.key;
      typedRef.current = next;
      setTyped(next);
      if (next.length === text.length) finish(next);
    } else {
      playWrong();
      wrongCountRef.current += 1;
      setWrongIdx(pos);
    }
  }, [text, startTimer, playClick, playWrong, resume, finish]);

  const handleCompositionUpdate = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    setComposingInput(e.data ?? "");
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    setComposingInput("");
    const committed = e.data;
    if (!committed) return;

    startTimer();
    jamoCountRef.current += countJamo(committed);
    totalKeysRef.current += committed.length;

    const pos = typedRef.current.length;
    const target = text.slice(pos, pos + committed.length);
    const correct = committed === target;

    if (correct) {
      playClick();
      setWrongIdx(null);
      const next = typedRef.current + committed;
      typedRef.current = next;
      setTyped(next);
      if (next.length >= text.length) finish(next);
    } else {
      playWrong();
      wrongCountRef.current += committed.length;
      setWrongIdx(pos);
    }
    if (inputRef.current) inputRef.current.value = "";
  }, [text, startTimer, playClick, playWrong, finish]);

  const handleKoreanKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    resume();
    if (e.key === " ") {
      e.preventDefault();
      startTimer();
      jamoCountRef.current += 1;
      totalKeysRef.current += 1;
      const pos = typedRef.current.length;
      if (pos < text.length && text[pos] === " ") {
        playClick();
        setWrongIdx(null);
        const next = typedRef.current + " ";
        typedRef.current = next;
        setTyped(next);
        if (next.length >= text.length) finish(next);
      } else {
        playWrong();
        wrongCountRef.current += 1;
        setWrongIdx(pos);
      }
    } else if (e.key === "Backspace") {
      e.preventDefault();
    }
  }, [text, startTimer, playClick, playWrong, resume, finish]);

  const fontSize = FONT_SIZE[tier] ?? "text-xl";
  const nextChar = text[typed.length] ?? "";

  return (
    <div className="space-y-4">
      {/* Live stats */}
      <div className="flex gap-6 text-center">
        <div className="flex-1 bg-white rounded-2xl py-3 shadow-sm border border-gray-100">
          <p className="text-2xl font-black text-green-600">{speed}</p>
          <p className="text-xs font-bold text-gray-400">{language === "english" ? "WPM" : "타/분"}</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl py-3 shadow-sm border border-gray-100">
          <p className="text-2xl font-black text-blue-600">{accuracy}%</p>
          <p className="text-xs font-bold text-gray-400">{uiLang === "en" ? "Accuracy" : "정확도"}</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl py-3 shadow-sm border border-gray-100">
          <p className="text-2xl font-black text-purple-600">{formatTime(elapsedMs)}</p>
          <p className="text-xs font-bold text-gray-400">{uiLang === "en" ? "Time" : "시간"}</p>
        </div>
      </div>

      {/* Target text */}
      <div
        className={`bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 font-mono ${fontSize} leading-relaxed select-none cursor-text`}
        onClick={() => inputRef.current?.focus()}
      >
        {text.split("").map((ch, i) => {
          let cls = "text-gray-300";
          if (i < typed.length) {
            cls = typed[i] === ch ? "text-green-600" : "text-red-500 bg-red-50 rounded";
          } else if (i === typed.length) {
            cls = wrongIdx === i
              ? "border-b-2 border-red-500 text-gray-800"
              : "border-b-2 border-green-500 text-gray-800";
          }
          // Korean IME: show in-progress composed syllable at cursor
          if (language === "korean" && i === typed.length && composingInput) {
            return <span key={i} className="border-b-2 border-blue-400 text-blue-600">{composingInput}</span>;
          }
          return <span key={i} className={cls}>{ch}</span>;
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-green-400 h-2 rounded-full transition-all duration-150"
          style={{ width: `${(typed.length / text.length) * 100}%` }}
        />
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        className="opacity-0 absolute w-0 h-0 pointer-events-none"
        aria-label="typing input"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onKeyDown={language === "english" ? handleKeyDown : handleKoreanKeyDown}
        onCompositionUpdate={handleCompositionUpdate}
        onCompositionEnd={handleCompositionEnd}
      />

      {!startTime && (
        <p className="text-center text-sm font-bold text-gray-400">
          {uiLang === "en" ? "Click above and start typing!" : "위를 클릭하고 타이핑을 시작하세요!"}
        </p>
      )}

      {showKeyboard && (
        <div className="mt-2">
          <VirtualKeyboard nextChar={nextChar} language={language} />
        </div>
      )}
    </div>
  );
}
