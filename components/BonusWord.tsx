import type { BonusWordData } from "@/types/article";

interface BonusWordProps {
  data: BonusWordData;
}

export default function BonusWord({ data }: BonusWordProps) {
  return (
    <div className="bg-white rounded-3xl shadow-md border border-purple-100 overflow-hidden h-full flex flex-col">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3.5">
        <h3 className="text-white font-black text-base flex items-center gap-2">
          <span>📖</span> Today&apos;s Bonus Word
        </h3>
      </div>

      <div className="px-5 py-4 flex flex-col gap-3 flex-1">
        {/* Word + pronunciation */}
        <div>
          <span className="text-2xl font-black text-purple-700">
            &ldquo;{data.word}&rdquo;
          </span>
          <span className="font-mono text-sm text-gray-400 font-bold ml-2">
            ({data.sound})
          </span>
          <p className="text-base font-bold text-indigo-600 mt-0.5">= {data.korean}</p>
        </div>

        {/* Example sentence */}
        <div className="bg-purple-50 rounded-xl px-4 py-2.5">
          <p className="text-xs font-bold text-gray-500 mb-0.5">Example:</p>
          <p className="text-base font-bold text-gray-800 italic">
            &ldquo;{data.example}&rdquo;
          </p>
        </div>

        {/* Challenge */}
        <div className="bg-indigo-50 rounded-xl px-4 py-2.5">
          <p className="text-sm font-bold text-indigo-800">
            🎯 {data.challenge}
          </p>
        </div>
      </div>
    </div>
  );
}
