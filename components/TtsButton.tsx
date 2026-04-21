"use client";

import { useState, useEffect, useRef } from "react";

interface TtsButtonProps {
  categoryColor: string;
  text: string;
}

function getPreferredVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const preferred = [
    "Microsoft Aria Online (Natural) - en-US",
    "Microsoft Jenny Online (Natural) - en-US",
    "Google US English",
    "Samantha",
    "Ava",
    "Karen",
  ];
  const found = preferred.reduce<SpeechSynthesisVoice | null>((acc, name) => {
    if (acc) return acc;
    return voices.find((v) => v.name === name) ?? null;
  }, null);
  return found ?? voices.find((v) => v.lang === "en-US") ?? null;
}

export default function TtsButton({ categoryColor, text }: TtsButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Pre-load voices (Chrome loads them async on first call)
  useEffect(() => {
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      window.speechSynthesis.cancel();
    };
  }, []);

  function handleClick() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.0;
    utterance.pitch = 1.15;
    const voice = getPreferredVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-white shadow-sm transition-opacity opacity-80 hover:opacity-100 ${categoryColor}`}
      aria-label={speaking ? "Stop reading aloud" : "Read aloud"}
    >
      {speaking ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
              clipRule="evenodd"
            />
          </svg>
          Stop Reading
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
          </svg>
          Read Aloud
        </>
      )}
    </button>
  );
}
