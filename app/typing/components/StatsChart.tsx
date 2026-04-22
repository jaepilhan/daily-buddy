"use client";

import type { TypingRecord } from "../lib/storage";

interface Props {
  records: TypingRecord[];
  language: "english" | "korean";
  uiLang: "en" | "ko";
}

export default function StatsChart({ records, language, uiLang }: Props) {
  const filtered = records.filter((r) => r.language === language).slice(-20);
  if (filtered.length < 2) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center text-gray-400 font-bold border border-gray-100">
        {uiLang === "en" ? "Complete 2+ exercises to see chart" : "2회 이상 완료하면 차트가 나타납니다"}
      </div>
    );
  }

  const maxWPM = Math.max(...filtered.map((r) => r.wpm));
  const unit = language === "english" ? "WPM" : (uiLang === "en" ? "KPM" : "타/분");
  const height = 120;
  const width = 400;
  const padX = 8;
  const padY = 10;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = filtered.map((r, i) => ({
    x: padX + (i / (filtered.length - 1)) * innerW,
    y: padY + innerH - (r.wpm / maxWPM) * innerH,
    wpm: r.wpm,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <p className="text-xs font-black text-gray-500 mb-2 uppercase">
        {language === "english" ? "English" : "Korean"} — {unit} {uiLang === "en" ? "Progress" : "진행"}
      </p>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 120 }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={padX} y1={padY + innerH * (1 - frac)}
            x2={width - padX} y2={padY + innerH * (1 - frac)}
            stroke="#f0f0f0" strokeWidth="1"
          />
        ))}
        {/* Filled area */}
        <polygon
          points={`${points[0].x},${padY + innerH} ${polyline} ${points[points.length - 1].x},${padY + innerH}`}
          fill="#bbf7d0"
          opacity="0.5"
        />
        {/* Line */}
        <polyline points={polyline} fill="none" stroke="#16a34a" strokeWidth="2" strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#16a34a" />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-gray-400 font-bold mt-1">
        <span>0</span>
        <span>{Math.round(maxWPM)} {unit}</span>
      </div>
    </div>
  );
}
