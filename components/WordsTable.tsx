import type { VocabWord } from "@/types/article";

interface WordsTableProps {
  words: VocabWord[];
  accentColor: string;
}

export default function WordsTable({ words, accentColor }: WordsTableProps) {
  return (
    <div>
      <h3 className="text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
        <span>📚</span> Words to Learn
      </h3>
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
        <table className="w-full text-base">
          <thead>
            <tr className={`${accentColor}`}>
              <th className="text-left px-4 py-2.5 font-black w-1/3">Word</th>
              <th className="text-left px-4 py-2.5 font-black w-1/4">Sound</th>
              <th className="text-left px-4 py-2.5 font-black">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, i) => (
              <tr key={word.word} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-black text-gray-900">{word.word}</td>
                <td className="px-4 py-3 font-mono text-sm text-gray-500 font-bold">{word.sound}</td>
                <td className="px-4 py-3 text-gray-700 font-semibold">{word.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
