"use client";

import { CATEGORIES } from "@/lib/categories";
import type { CategoryId } from "@/types/article";

interface CategoryTabsProps {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 px-4 py-2.5 md:justify-center max-w-[1400px] mx-auto">
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === active;
            return (
              <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                className={`flex-none flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-sm transition-all duration-150 whitespace-nowrap
                  ${
                    isActive
                      ? `${cat.tabColor} shadow-md scale-105`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <span className="text-base leading-none">{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
