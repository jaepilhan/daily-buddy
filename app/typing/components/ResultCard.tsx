"use client";

import { formatTime } from "../lib/calculator";
import type { TypingRecord } from "../lib/storage";

interface Props {
  result: TypingRecord;
  prevBest: TypingRecord | null;
  isNewRecord: boolean;
  language: "english" | "korean";
  onRetry: () => void;
  onNextLevel: () => void;
  uiLang: "en" | "ko";
}

const T = {
  en: {
    newRecord: "🎉 New Personal Record!",
    speed: "Speed",
    accuracy: "Accuracy",
    time: "Time",
    prevBest: "Previous Best",
    retry: "Try Again",
    next: "Next Level →",
    unit: (l: string) => l === "english" ? "WPM" : "KPM",
  },
  ko: {
    newRecord: "🎉 신기록 달성!",
    speed: "속도",
    accuracy: "정확도",
    time: "시간",
    prevBest: "이전 최고",
    retry: "다시 하기",
    next: "다음 단계 →",
    unit: (l: string) => l === "english" ? "WPM" : "타/분",
  },
};

export default function ResultCard({ result, prevBest, isNewRecord, language, onRetry, onNextLevel, uiLang }: Props) {
  const t = T[uiLang];
  const unit = t.unit(language);

  return (
    <div className={`rounded-3xl shadow-lg p-8 text-center border-2 ${
      isNewRecord ? "border-yellow-400 bg-yellow-50" : "border-green-200 bg-green-50"
    }`}>
      {isNewRecord && (
        <div className="text-2xl font-black text-yellow-600 mb-4 animate-bounce">
          {t.newRecord}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t.speed}</p>
          <p className="text-3xl font-black text-green-600">{result.wpm}</p>
          <p className="text-xs font-bold text-gray-500">{unit}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t.accuracy}</p>
          <p className="text-3xl font-black text-blue-600">{result.accuracy}%</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">{t.time}</p>
          <p className="text-3xl font-black text-purple-600">{formatTime(result.durationMs)}</p>
        </div>
      </div>

      {prevBest && !isNewRecord && (
        <p className="text-sm font-bold text-gray-500 mb-6">
          {t.prevBest}: {prevBest.wpm} {unit} · {prevBest.accuracy}%
        </p>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-6 py-3 rounded-xl font-black text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-400 transition-all hover:scale-105"
        >
          {t.retry}
        </button>
        <button
          onClick={onNextLevel}
          className="px-6 py-3 rounded-xl font-black text-white bg-green-500 hover:bg-green-600 transition-all hover:scale-105 shadow-md"
        >
          {t.next}
        </button>
      </div>
    </div>
  );
}
