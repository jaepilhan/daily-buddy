"use client";

import { LEVEL_CONFIG, LEVEL_ORDER } from "@/data/registry";
import type { LevelKey } from "@/types/article";

interface LevelSwitcherProps {
  active: LevelKey;
  onChange: (level: LevelKey) => void;
}

export default function LevelSwitcher({ active, onChange }: LevelSwitcherProps) {
  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-3 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {LEVEL_ORDER.map((key) => {
          const cfg = LEVEL_CONFIG[key];
          const isActive = key === active;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-150
                ${
                  isActive
                    ? "bg-gray-800 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
              <span className="text-[10px] opacity-70">({cfg.ages})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
