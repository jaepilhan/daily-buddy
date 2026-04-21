"use client";

import { useState } from "react";
import type { CategoryConfig, CategoryId, LevelKey } from "@/types/article";

interface ImagePlaceholderProps {
  category: CategoryConfig;
  headline: string;
  levelKey: LevelKey;
  isoDate: string; // "2026-04-22"
}

const CAT_NUMBERS: Record<CategoryId, number> = {
  amazing_world: 1,
  economy: 2,
  tech: 3,
  kpop: 4,
  sports: 5,
};

const LEVEL_NUMBERS: Record<LevelKey, number> = {
  little_buddy: 1,
  explorer_buddy: 2,
  pro_buddy: 3,
};

function buildImagePath(
  categoryId: CategoryId,
  levelKey: LevelKey,
  isoDate: string
): string {
  const catNum = CAT_NUMBERS[categoryId];
  const levelNum = LEVEL_NUMBERS[levelKey];
  // "2026-04-22" → "260422"
  const [year, month, day] = isoDate.split("-");
  const dateStr = year.slice(2) + month + day;
  return `/images/img${catNum}_${levelNum}_${dateStr}.png`;
}

export default function ImagePlaceholder({
  category,
  headline,
  levelKey,
  isoDate,
}: ImagePlaceholderProps) {
  const [imgError, setImgError] = useState(false);
  const imgPath = buildImagePath(category.id, levelKey, isoDate);

  if (!imgError) {
    return (
      // Using <img> (not Next.js Image) for reliable onError fallback behavior
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgPath}
        alt={headline}
        className="w-full h-[150px] object-cover rounded-2xl"
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback when image file is missing
  return (
    <div
      className={`w-full h-[150px] ${category.patternColor} rounded-2xl flex flex-col items-center justify-center gap-1 relative overflow-hidden`}
      aria-label={`Image for: ${headline}`}
    >
      <div
        className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-30 ${category.bgColor}`}
      />
      <div
        className={`absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-30 ${category.bgColor}`}
      />
      <span className="text-5xl drop-shadow-sm z-10">{category.emoji}</span>
      <span className="text-[10px] font-bold text-gray-400 z-10 tracking-widest uppercase">
        Image coming soon
      </span>
    </div>
  );
}
