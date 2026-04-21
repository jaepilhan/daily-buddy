"use client";

import type { DateEntry } from "@/data/registry";

interface DateNavProps {
  dates: DateEntry[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export default function DateNav({ dates, activeIndex, onChange }: DateNavProps) {
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < dates.length - 1;
  const current = dates[activeIndex];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 py-2 flex items-center justify-center gap-3">
        <button
          onClick={() => onChange(activeIndex - 1)}
          disabled={!hasPrev}
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 disabled:opacity-25 hover:bg-gray-100 transition-colors font-bold text-lg"
          aria-label="Previous date"
        >
          ‹
        </button>

        <span className="text-sm font-black text-gray-700 min-w-[160px] text-center">
          {current.dayOfWeek}, {current.label}
        </span>

        <button
          onClick={() => onChange(activeIndex + 1)}
          disabled={!hasNext}
          className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 disabled:opacity-25 hover:bg-gray-100 transition-colors font-bold text-lg"
          aria-label="Next date"
        >
          ›
        </button>
      </div>
    </div>
  );
}
