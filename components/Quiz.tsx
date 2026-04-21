"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types/article";

const OPTION_LABELS = ["🅐", "🅑", "🅒"];

interface QuizProps {
  questions: QuizQuestion[];
}

export default function Quiz({ questions }: QuizProps) {
  const [selected, setSelected] = useState<(number | null)[]>(
    questions.map(() => null)
  );

  function handleSelect(qIdx: number, oIdx: number) {
    if (selected[qIdx] !== null) return;
    setSelected((prev) => {
      const next = [...prev];
      next[qIdx] = oIdx;
      return next;
    });
  }

  return (
    <div>
      <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
        <span>✅</span> Quiz Time!
      </h3>
      <div className="flex flex-col gap-6">
        {questions.map((q, qIdx) => {
          const chosen = selected[qIdx];
          const answered = chosen !== null;
          const isRight = answered && chosen === q.answerIndex;

          return (
            <div key={qIdx}>
              <p className="font-black text-base text-gray-800 mb-2">
                {qIdx + 1}. {q.question}
              </p>

              <div className="flex flex-col gap-2 mb-2">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.answerIndex;
                  const isChosen = chosen === oIdx;

                  let style =
                    "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400 cursor-pointer";

                  if (answered) {
                    if (isCorrect) {
                      style =
                        "bg-green-100 border-2 border-green-400 text-green-900 font-bold cursor-default";
                    } else if (isChosen) {
                      style =
                        "bg-red-100 border-2 border-red-400 text-red-700 line-through cursor-default";
                    } else {
                      style =
                        "bg-white border-2 border-gray-100 text-gray-400 cursor-default";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      disabled={answered}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-semibold text-left transition-all duration-150 ${style}`}
                    >
                      <span className="text-base leading-none flex-none">
                        {OPTION_LABELS[oIdx]}
                      </span>
                      <span>{opt}</span>
                      {answered && isCorrect && (
                        <span className="ml-auto text-green-500 font-black">✓</span>
                      )}
                      {answered && isChosen && !isCorrect && (
                        <span className="ml-auto text-red-400 font-black">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback message */}
              {answered && (
                <div
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-base transition-all ${
                    isRight
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isRight ? "Correct! 🎉" : "Try again! 💪"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
