import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.ts",
    "./data/**/*.ts",
  ],
  safelist: [
    // Category tab / badge / TTS button colors
    "bg-green-500", "bg-yellow-400", "bg-blue-500", "bg-pink-400", "bg-orange-400",
    // Category page backgrounds
    "bg-green-50",  "bg-yellow-50",  "bg-blue-50",  "bg-pink-50",  "bg-orange-50",
    // Category placeholder / pattern backgrounds
    "bg-green-100", "bg-yellow-100", "bg-blue-100", "bg-pink-100", "bg-orange-100",
    // Category borders
    "border-green-300", "border-yellow-300", "border-blue-300",
    "border-pink-300",  "border-orange-300",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito)", "Nunito", "sans-serif"],
      },
    },
  },
  plugins: [
    function ({
      addUtilities,
    }: {
      addUtilities: (u: Record<string, Record<string, string>>) => void;
    }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};

export default config;
