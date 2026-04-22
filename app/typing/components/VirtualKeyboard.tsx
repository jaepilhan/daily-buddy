"use client";

import type { Language } from "../lib/calculator";

interface Props {
  nextChar: string;
  language: Language;
}

const EN_ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l",";"],
  ["z","x","c","v","b","n","m",",",".","/"],
];

// 두벌식 layout: show the English key label + Korean jamo mapping
const KO_ROWS: { key: string; jamo: string }[][] = [
  [
    {key:"q",jamo:"ㅂ"},{key:"w",jamo:"ㅈ"},{key:"e",jamo:"ㄷ"},{key:"r",jamo:"ㄱ"},
    {key:"t",jamo:"ㅅ"},{key:"y",jamo:"ㅛ"},{key:"u",jamo:"ㅕ"},{key:"i",jamo:"ㅑ"},
    {key:"o",jamo:"ㅐ"},{key:"p",jamo:"ㅔ"},
  ],
  [
    {key:"a",jamo:"ㅁ"},{key:"s",jamo:"ㄴ"},{key:"d",jamo:"ㅇ"},{key:"f",jamo:"ㄹ"},
    {key:"g",jamo:"ㅎ"},{key:"h",jamo:"ㅗ"},{key:"j",jamo:"ㅓ"},{key:"k",jamo:"ㅏ"},
    {key:"l",jamo:"ㅣ"},{key:";",jamo:""},
  ],
  [
    {key:"z",jamo:"ㅋ"},{key:"x",jamo:"ㅌ"},{key:"c",jamo:"ㅊ"},{key:"v",jamo:"ㅍ"},
    {key:"b",jamo:"ㅠ"},{key:"n",jamo:"ㅜ"},{key:"m",jamo:"ㅡ"},{key:",",jamo:""},
    {key:".",jamo:""},{key:"/",jamo:""},
  ],
];

function isNextKey(nextChar: string, key: string, language: Language): boolean {
  if (!nextChar || nextChar === " ") return false;
  const lower = nextChar.toLowerCase();
  if (language === "english") return lower === key;
  // For Korean, map the jamo back to the key
  const allKo = KO_ROWS.flat();
  const found = allKo.find((k) => {
    // Try to match the composed syllable initial or the jamo directly
    return k.jamo && (nextChar === k.jamo || nextChar.includes(k.jamo));
  });
  return found?.key === key;
}

export default function VirtualKeyboard({ nextChar, language }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 select-none">
      {language === "english"
        ? EN_ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.map((key) => {
                const active = isNextKey(nextChar, key, language);
                return (
                  <div
                    key={key}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border-2 transition-all ${
                      active
                        ? "bg-green-400 border-green-600 text-white scale-110 shadow-md"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    {key.toUpperCase()}
                  </div>
                );
              })}
            </div>
          ))
        : KO_ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.map(({ key, jamo }) => {
                const active = isNextKey(nextChar, key, language);
                return (
                  <div
                    key={key}
                    className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${
                      active
                        ? "bg-green-400 border-green-600 text-white scale-110 shadow-md"
                        : "bg-white border-gray-200 text-gray-600"
                    }`}
                  >
                    <span className="text-[9px] text-gray-400 leading-none">{key.toUpperCase()}</span>
                    <span className="text-sm font-black leading-none">{jamo}</span>
                  </div>
                );
              })}
            </div>
          ))}
      {/* Space bar */}
      <div className={`w-48 h-7 rounded-lg flex items-center justify-center text-xs font-bold border-2 transition-all ${
        nextChar === " "
          ? "bg-green-400 border-green-600 text-white scale-105 shadow-md"
          : "bg-white border-gray-200 text-gray-500"
      }`}>
        SPACE
      </div>
    </div>
  );
}
