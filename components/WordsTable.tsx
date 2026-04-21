"use client";

import type { VocabWord } from "@/types/article";

interface WordsTableProps {
  words: VocabWord[];
  accentColor: string;
}

function speakWord(word: string) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  utterance.pitch = 1.1;

  const voices = window.speechSynthesis.getVoices();
  const preferred = [
    "Microsoft Aria Online (Natural) - en-US",
    "Microsoft Jenny Online (Natural) - en-US",
    "Google US English",
    "Samantha",
    "Ava",
  ];
  const voice =
    preferred.reduce<SpeechSynthesisVoice | null>((found, name) => {
      if (found) return found;
      return voices.find((v) => v.name === name) ?? null;
    }, null) ?? voices.find((v) => v.lang === "en-US") ?? null;

  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export default function WordsTable({ words, accentColor }: WordsTableProps) {
  return (
    <div>
      <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
        <span>📚</span> Words to Learn
      </h3>
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <table className="w-full text-base">
          <thead>
            <tr className={`${accentColor}`}>
              <th className="text-left px-4 py-2.5 font-black w-1/4">Word</th>
              <th className="text-left px-4 py-2.5 font-black w-1/4">Sound</th>
              <th className="text-left px-4 py-2.5 font-black">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, i) => {
              const parts = word.meaning.split(" — ");
              const korean = parts[0];
              const english = parts[1] ?? "";
              return (
                <tr key={word.word} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 font-black text-gray-900">{word.word}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => speakWord(word.word)}
                      className="flex items-center gap-1.5 group"
                      aria-label={`Hear pronunciation of ${word.word}`}
                      title={`Click to hear: ${word.word}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 flex-shrink-0"
                      >
                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
                      </svg>
                      <span className="font-mono text-sm text-gray-500 font-bold group-hover:text-gray-700">
                        {word.sound}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-black text-gray-900 block">{korean}</span>
                    {english && (
                      <span className="text-sm text-gray-500 font-semibold">{english}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
