"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import LevelSwitcher from "@/components/LevelSwitcher";
import DateNav from "@/components/DateNav";
import CategoryTabs from "@/components/CategoryTabs";
import ArticleCard from "@/components/ArticleCard";
import WordsTable from "@/components/WordsTable";
import Quiz from "@/components/Quiz";
import BonusWord from "@/components/BonusWord";
import { getCategoryConfig } from "@/lib/categories";
import { DATES, getContent } from "@/data/registry";
import type { CategoryId, LevelKey } from "@/types/article";

export default function ReadPage() {
  const [levelKey, setLevelKey] = useState<LevelKey>("little_buddy");
  const [dateIndex, setDateIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("amazing_world");

  const dateEntry = DATES[dateIndex];
  const dailyContent = getContent(dateEntry.dateKey, levelKey);
  const article =
    dailyContent?.articles.find((a) => a.category === activeCategory) ??
    dailyContent?.articles[0];
  const cat = getCategoryConfig(activeCategory);

  // Key forces full remount (including Quiz state reset) on nav change
  const contentKey = `${dateEntry.dateKey}-${levelKey}-${activeCategory}`;

  return (
    <div>
      {/* ── Sticky nav block ── */}
      <div className="sticky top-0 z-20 shadow-sm">
        {/* Home link */}
        <div className="bg-white px-4 pt-1.5 pb-0 border-b border-gray-50">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-black text-gray-400 hover:text-gray-700 transition-colors py-1"
          >
            ← Home
          </Link>
        </div>

        <Header levelKey={levelKey} />
        <LevelSwitcher active={levelKey} onChange={setLevelKey} />
        <DateNav dates={DATES} activeIndex={dateIndex} onChange={setDateIndex} />
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* ── Main content ── */}
      <main>
        {!dailyContent || !article ? (
          /* Coming Soon */
          <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 bg-gray-50">
            <span className="text-6xl mb-4">🐻</span>
            <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">
              Coming Soon — Stay tuned!
            </h2>
            <p className="text-base font-bold text-gray-500 text-center max-w-sm">
              We&apos;re working on this level. Check back soon!
            </p>
          </div>
        ) : (
          // key here remounts everything on category/level/date change
          // → fixes body text disappearing, resets quiz state
          <div key={contentKey}>
            {/* ── Category-colored zone ── */}
            <div className={cat.bgColor}>
              {/* Badge + Headline + Image + TTS */}
              <ArticleCard
                article={article}
                levelKey={levelKey}
                isoDate={dateEntry.isoDate}
              />

              {/* ── 3-column: [Words | Body | Bonus] ── */}
              {/*
                Mobile:  Body → Words → Bonus (stacked, using CSS order)
                PC(md+): Words | Body | Bonus  (grid, 1fr 2fr 1fr)
              */}
              <div className="max-w-[1400px] mx-auto px-4 pb-8">
                <div className="flex flex-col md:grid md:grid-cols-[3fr_1fr] md:gap-8 md:items-start">

                  {/* Left column: Body + Words stacked (mobile & PC) */}
                  <div>
                    {/* Body paragraphs */}
                    <div className="mt-4 md:mt-0">
                      {article.body.map((para, i) => (
                        <p
                          key={i}
                          className="text-[20px] font-semibold text-gray-800 whitespace-pre-line mb-4 last:mb-0"
                          style={{ lineHeight: 1.8 }}
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    {/* Words to Learn — below body on both mobile and PC */}
                    <div className="mt-8">
                      <WordsTable
                        words={article.vocab}
                        accentColor={cat.tabColor}
                      />
                    </div>
                  </div>

                  {/* Right column — Bonus Word */}
                  <div className="mt-8 md:mt-0">
                    <BonusWord data={dailyContent.bonusWord} />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Quiz + footer (white background) ── */}
            <div className="bg-white border-t border-gray-100">
              <div className="max-w-[1400px] mx-auto px-4 py-8">
                <Quiz questions={article.quiz} />
              </div>
              <div className="pb-8 text-center">
                <p className="text-sm font-bold text-gray-500 leading-relaxed">
                  🐻 See you tomorrow, friends!
                  <br />
                  Remember — you are never too young to learn something new!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
