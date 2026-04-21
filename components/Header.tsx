import Link from "next/link";
import type { LevelKey } from "@/types/article";
import { LEVEL_CONFIG } from "@/data/registry";

interface HeaderProps {
  levelKey: LevelKey;
}

export default function Header({ levelKey }: HeaderProps) {
  const cfg = LEVEL_CONFIG[levelKey];

  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-3xl leading-none">🐻</span>
          <h1 className="text-[28px] font-black text-gray-900 leading-tight">
            Daily Buddy
          </h1>
        </Link>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-black px-3 py-1 rounded-full">
            {cfg.emoji} {cfg.label} Edition
          </span>
          <p className="text-xs text-gray-400 mt-0.5 font-bold">
            Ages {cfg.ages}
          </p>
        </div>
      </div>
    </div>
  );
}
