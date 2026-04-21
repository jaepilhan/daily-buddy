import type { BonusWordData } from "@/types/article";

interface BonusWordProps {
  data: BonusWordData[];
}

export default function BonusWord({ data }: BonusWordProps) {
  return (
    <div className="bg-white rounded-3xl shadow-md border border-purple-100 overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3.5">
        <h3 className="text-white font-black text-base flex items-center gap-2">
          <span>📖</span> Today&apos;s Bonus Words
        </h3>
      </div>

      <div className="px-5 py-4 flex flex-col gap-5">
        {data.map((item, i) => (
          <div key={item.word}>
            {i > 0 && <div className="border-t border-purple-100 -mx-5 mb-5" />}

            {/* Word + pronunciation + Korean */}
            <div>
              <span className="text-xl font-black text-purple-700">
                &ldquo;{item.word}&rdquo;
              </span>
              <span className="font-mono text-sm text-gray-400 font-bold ml-2">
                ({item.sound})
              </span>
              <p className="text-base font-bold text-indigo-600 mt-0.5">= {item.korean}</p>
            </div>

            {/* Example sentence */}
            <div className="bg-purple-50 rounded-xl px-4 py-2.5 mt-2">
              <p className="text-xs font-bold text-gray-500 mb-0.5">Example:</p>
              <p className="text-sm font-bold text-gray-800 italic">
                &ldquo;{item.example}&rdquo;
              </p>
            </div>

            {/* Challenge */}
            <div className="bg-indigo-50 rounded-xl px-4 py-2.5 mt-2">
              <p className="text-sm font-bold text-indigo-800">
                🎯 {item.challenge}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
