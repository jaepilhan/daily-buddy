"use client";

import { useRef, useState } from "react";
import type { PodcastLine } from "@/types/article";

interface PodcastPlayerProps {
  script: PodcastLine[];
  cacheKey: string;
}

export default function PodcastPlayer({ script, cacheKey }: PodcastPlayerProps) {
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handleClick() {
    if (state === "ready" && audioRef.current) {
      audioRef.current.play();
      return;
    }
    if (state === "loading") return;

    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/podcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, cacheKey }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setState("ready");

      // Auto-play after next render (audioRef set by React)
      setTimeout(() => audioRef.current?.play(), 50);
    } catch (err) {
      console.error("[PodcastPlayer]", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to generate podcast");
      setState("error");
    }
  }

  return (
    <div className="mt-3">
      {/* Button */}
      <button
        onClick={handleClick}
        disabled={state === "loading"}
        className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-white shadow-sm transition-opacity opacity-80 hover:opacity-100 disabled:opacity-50 bg-purple-500"
        aria-label="Listen to podcast"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
          <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
        </svg>
        {state === "loading" ? "🎙️ Generating..." : "🎙️ Podcast"}
      </button>

      {state === "error" && (
        <p className="mt-2 text-xs text-red-500 font-bold">{errorMsg}</p>
      )}

      {state === "ready" && audioUrl && (
        <div className="mt-4 space-y-4">
          {/* Audio player */}
          <audio
            ref={audioRef}
            src={audioUrl}
            controls
            className="w-full rounded-xl"
          />

          {/* Chat bubbles */}
          <div className="space-y-2">
            {script.map((line, i) => {
              const isRachel = line.speaker === "Rachel";
              return (
                <div
                  key={i}
                  className={`flex flex-col gap-0.5 ${isRachel ? "items-start" : "items-end"}`}
                >
                  <span className="text-xs font-bold text-gray-400 px-1">
                    {line.speaker}
                  </span>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm text-sm font-medium text-gray-800 leading-relaxed ${
                      isRachel
                        ? "bg-pink-100 rounded-tl-sm"
                        : "bg-blue-100 rounded-tr-sm"
                    }`}
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {line.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
