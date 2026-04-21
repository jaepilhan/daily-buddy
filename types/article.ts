export type CategoryId =
  | "amazing_world"
  | "economy"
  | "tech"
  | "kpop"
  | "sports";

export type LevelKey = "little_buddy" | "explorer_buddy" | "pro_buddy";

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  emoji: string;
  tabColor: string;
  bgColor: string;
  patternColor: string;
  borderColor: string;
}

export interface VocabWord {
  word: string;
  sound: string;
  meaning: string; // format: "한글 뜻 — English meaning"
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

export interface Article {
  id: string;
  category: CategoryId;
  headline: string;
  body: string[];
  vocab: VocabWord[];
  quiz: QuizQuestion[];
}

export interface BonusWordData {
  word: string;
  sound: string;
  korean: string;
  example: string;
  challenge: string;
}

export interface DailyContent {
  date: string;
  dayOfWeek: string;
  level: string;
  levelEmoji: string;
  ageRange: string;
  articles: Article[];
  bonusWords: BonusWordData[];
}
