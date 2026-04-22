"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatsChart from "../components/StatsChart";
import { getActiveUser, getRecords, getPersonalBest, type TypingRecord } from "../lib/storage";
import { ENGLISH_LEVELS } from "../data/english";
import { KOREAN_LEVELS } from "../data/korean";
import { formatTime } from "../lib/calculator";

export default function StatsPage() {
  const [user, setUser] = useState<string | null>(null);
  const [records, setRecords] = useState<TypingRecord[]>([]);
  const [tab, setTab] = useState<"english" | "korean">("english");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getActiveUser();
    setUser(u);
    if (u) setRecords(getRecords(u));
  }, []);

  if (!mounted) return null;

  const recent = records.filter((r) => r.language === tab).slice(-10).reverse();
  const levels = tab === "english" ? ENGLISH_LEVELS : KOREAN_LEVELS;
  const unit = tab === "english" ? "WPM" : "타/분";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Nav */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/typing" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🐻</span>
            <span className="font-black text-gray-900">Daily Buddy</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/typing/english" className="text-xs font-black text-gray-400 hover:text-gray-700 px-2">🇺🇸 English</Link>
            <Link href="/typing/korean" className="text-xs font-black text-gray-400 hover:text-gray-700 px-2">🇰🇷 한국어</Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">📊 My Records</h1>
            {user && <p className="text-sm font-bold text-gray-400">👤 {user}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("english")}
              className={`px-4 py-2 rounded-xl text-sm font-black transition-all border ${
                tab === "english" ? "bg-blue-500 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => setTab("korean")}
              className={`px-4 py-2 rounded-xl text-sm font-black transition-all border ${
                tab === "korean" ? "bg-red-500 text-white border-red-600" : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              🇰🇷 한국어
            </button>
          </div>
        </div>

        {!user ? (
          <div className="text-center py-16">
            <p className="text-gray-400 font-bold mb-4">No user selected.</p>
            <Link href="/typing" className="text-purple-500 font-black hover:underline">Go to Typing Hub →</Link>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">⌨️</span>
            <p className="text-gray-500 font-bold mb-4">No records yet. Start practicing!</p>
            <Link href="/typing/english" className="inline-block bg-blue-500 text-white font-black px-6 py-3 rounded-xl hover:scale-105 transition-all">
              Start English →
            </Link>
          </div>
        ) : (
          <>
            {/* Progress chart */}
            <div className="mb-6">
              <StatsChart records={records} language={tab} uiLang="en" />
            </div>

            {/* Personal bests table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
              <div className="bg-purple-500 px-4 py-3">
                <h2 className="font-black text-white">🏆 Personal Bests</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-2 font-black text-gray-600">Level</th>
                    <th className="text-right px-4 py-2 font-black text-gray-600">{unit}</th>
                    <th className="text-right px-4 py-2 font-black text-gray-600">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {levels.map((lv, i) => {
                    const best = user ? getPersonalBest(user, lv.id, tab) : null;
                    return (
                      <tr key={lv.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2 font-bold text-gray-700">{lv.label}</td>
                        <td className="px-4 py-2 text-right font-black text-green-600">
                          {best ? best.wpm : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-blue-600">
                          {best ? `${best.accuracy}%` : <span className="text-gray-300">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Recent 10 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-800 px-4 py-3">
                <h2 className="font-black text-white">🕐 Recent Sessions</h2>
              </div>
              {recent.length === 0 ? (
                <p className="text-center py-8 text-gray-400 font-bold text-sm">
                  No {tab} records yet.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-2 font-black text-gray-600">Level</th>
                      <th className="text-right px-4 py-2 font-black text-gray-600">{unit}</th>
                      <th className="text-right px-4 py-2 font-black text-gray-600">Acc</th>
                      <th className="text-right px-4 py-2 font-black text-gray-600">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2 font-bold text-gray-700 text-xs">{r.levelId}</td>
                        <td className="px-4 py-2 text-right font-black text-green-600">{r.wpm}</td>
                        <td className="px-4 py-2 text-right font-bold text-blue-600">{r.accuracy}%</td>
                        <td className="px-4 py-2 text-right font-bold text-gray-400">{formatTime(r.durationMs)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
