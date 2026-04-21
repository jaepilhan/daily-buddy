import type { CategoryConfig, CategoryId } from "@/types/article";

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "amazing_world",
    label: "Amazing World",
    emoji: "🌍",
    tabColor: "bg-green-500 text-white",
    bgColor: "bg-green-50",
    patternColor: "bg-green-100",
    borderColor: "border-green-300",
  },
  {
    id: "economy",
    label: "Economy",
    emoji: "💰",
    tabColor: "bg-yellow-400 text-white",
    bgColor: "bg-yellow-50",
    patternColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
  },
  {
    id: "tech",
    label: "Tech",
    emoji: "🔬",
    tabColor: "bg-blue-500 text-white",
    bgColor: "bg-blue-50",
    patternColor: "bg-blue-100",
    borderColor: "border-blue-300",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    emoji: "🎬",
    tabColor: "bg-pink-400 text-white",
    bgColor: "bg-pink-50",
    patternColor: "bg-pink-100",
    borderColor: "border-pink-300",
  },
  {
    id: "sports",
    label: "Sports",
    emoji: "⚽",
    tabColor: "bg-orange-400 text-white",
    bgColor: "bg-orange-50",
    patternColor: "bg-orange-100",
    borderColor: "border-orange-300",
  },
];

export function getCategoryConfig(id: CategoryId): CategoryConfig {
  return CATEGORIES.find((c) => c.id === id)!;
}
