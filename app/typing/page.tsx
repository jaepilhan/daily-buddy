"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveUser, getUsers, addUser, setActiveUser } from "./lib/storage";

export default function TypingHub() {
  const [user, setUser] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [showSwitch, setShowSwitch] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getActiveUser());
  }, []);

  const handleAddUser = () => {
    const name = nameInput.trim();
    if (!name) return;
    addUser(name);
    setUser(name);
    setNameInput("");
  };

  const handleSwitch = (name: string) => {
    setActiveUser(name);
    setUser(name);
    setShowSwitch(false);
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">⌨️</span>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Typing Practice</h1>
          <p className="text-base font-bold text-gray-500">타자 연습</p>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-green-100 max-w-sm w-full p-8">
          <h2 className="text-lg font-black text-gray-800 mb-1">Who&apos;s practicing today?</h2>
          <p className="text-sm font-bold text-gray-400 mb-5">오늘 연습하는 사람은?</p>
          <input
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:border-green-400 mb-4"
            placeholder="Your name / 이름"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
            autoFocus
          />
          <button
            onClick={handleAddUser}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 rounded-xl transition-all hover:scale-105 shadow-md"
          >
            Let&apos;s Go! 🚀
          </button>

          {getUsers().length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-gray-400 text-center mb-2">or pick existing user</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {getUsers().map((u) => (
                  <button
                    key={u.name}
                    onClick={() => handleSwitch(u.name)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-green-100 rounded-full text-sm font-bold text-gray-700 transition-colors"
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center px-6 py-16">
      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🐻</span>
          <span className="font-black text-gray-900">Daily Buddy</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/read" className="text-xs font-black text-gray-400 hover:text-gray-700 transition-colors">📰 News</Link>
          <Link href="/typing/stats" className="text-xs font-black text-gray-400 hover:text-gray-700 transition-colors">📊 Stats</Link>
          <button
            onClick={() => setShowSwitch(!showSwitch)}
            className="text-xs font-black bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors"
          >
            👤 {user}
          </button>
        </div>
      </div>

      {showSwitch && (
        <div className="fixed top-14 right-4 z-20 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-[180px]">
          <p className="text-xs font-black text-gray-400 mb-2 uppercase">Switch User</p>
          {getUsers().map((u) => (
            <button
              key={u.name}
              onClick={() => handleSwitch(u.name)}
              className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                u.name === user ? "bg-green-100 text-green-700" : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              {u.name === user ? "✓ " : ""}{u.name}
            </button>
          ))}
          <button
            onClick={() => { setUser(null); setShowSwitch(false); }}
            className="block w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 mt-1 border-t border-gray-100 pt-2"
          >
            + Add new user
          </button>
        </div>
      )}

      <div className="pt-16 w-full max-w-lg">
        <div className="text-center mb-10">
          <span className="text-5xl block mb-3">⌨️</span>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Typing Practice</h1>
          <p className="text-base font-bold text-gray-500">타자 연습</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link
            href="/typing/english"
            className="bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-3xl p-8 text-center transition-all hover:scale-105 shadow-sm hover:shadow-md"
          >
            <div className="text-5xl mb-3">🇺🇸</div>
            <h2 className="text-xl font-black text-gray-900 mb-1">English</h2>
            <p className="text-sm font-bold text-gray-400">영어 타자</p>
            <p className="text-xs font-bold text-blue-500 mt-2">WPM</p>
          </Link>
          <Link
            href="/typing/korean"
            className="bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-400 rounded-3xl p-8 text-center transition-all hover:scale-105 shadow-sm hover:shadow-md"
          >
            <div className="text-5xl mb-3">🇰🇷</div>
            <h2 className="text-xl font-black text-gray-900 mb-1">한국어</h2>
            <p className="text-sm font-bold text-gray-400">Korean</p>
            <p className="text-xs font-bold text-red-500 mt-2">타수 (KPM)</p>
          </Link>
        </div>

        <Link
          href="/typing/game"
          className="block bg-gradient-to-r from-indigo-900 to-purple-900 hover:from-indigo-800 hover:to-purple-800 border-2 border-indigo-700 rounded-2xl px-6 py-4 text-center transition-all hover:scale-[1.02] shadow-sm mb-3"
        >
          <span className="text-2xl mr-2">🌧️</span>
          <span className="font-black text-white">Word Rain Game</span>
          <span className="font-bold text-white/50 text-sm ml-2">/ 단어 비 게임</span>
        </Link>

        <Link
          href="/typing/stats"
          className="block bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-2xl px-6 py-4 text-center transition-all hover:scale-[1.02] shadow-sm"
        >
          <span className="text-2xl mr-2">📊</span>
          <span className="font-black text-gray-800">My Records</span>
          <span className="font-bold text-gray-400 text-sm ml-2">/ 내 기록</span>
        </Link>
      </div>
    </main>
  );
}
