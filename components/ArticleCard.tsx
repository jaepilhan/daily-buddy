import type { Article, LevelKey } from "@/types/article";
import { getCategoryConfig } from "@/lib/categories";
import ImagePlaceholder from "./ImagePlaceholder";
import TtsButton from "./TtsButton";

interface ArticleCardProps {
  article: Article;
  levelKey: LevelKey;
  isoDate: string;
}

// Renders: category badge + headline + image + TTS button.
// Body, WordsTable, BonusWord, and Quiz are composed by the parent
// so they can be arranged in a 3-column PC layout.
export default function ArticleCard({ article, levelKey, isoDate }: ArticleCardProps) {
  const cat = getCategoryConfig(article.category);

  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-6 pb-4">
      {/* Category badge */}
      <div className="mb-3">
        <span
          className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white ${cat.tabColor}`}
        >
          {cat.emoji} {cat.label}
        </span>
      </div>

      {/* Headline */}
      <h2 className="text-2xl font-black text-gray-900 leading-tight mb-4">
        {article.headline}
      </h2>

      {/* Image */}
      <ImagePlaceholder
        category={cat}
        headline={article.headline}
        levelKey={levelKey}
        isoDate={isoDate}
      />

      {/* TTS button */}
      <div className="mt-3">
        <TtsButton categoryColor={cat.tabColor} text={article.body.join(" ")} />
      </div>
    </div>
  );
}
