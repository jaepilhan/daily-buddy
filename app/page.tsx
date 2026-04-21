import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center px-6 py-16">
      {/* Logo + title */}
      <div className="text-center mb-10">
        <span className="text-7xl block mb-4">🐻</span>
        <h1 className="text-[40px] font-black text-gray-900 leading-tight mb-2">
          Daily Buddy
        </h1>
        <p className="text-lg font-bold text-orange-500">
          Kids English News — Every Day
        </p>
      </div>

      {/* Standard badge */}
      <div className="bg-white rounded-3xl shadow-md border border-orange-100 max-w-md w-full px-8 py-7 mb-8 text-center">
        <div className="flex justify-center gap-3 mb-4 text-2xl">
          <span>🌍</span><span>💰</span><span>🔬</span><span>🎤</span><span>⚽</span>
        </div>
        <p className="text-base font-bold text-gray-700 leading-relaxed mb-3">
          Our content follows international education standards used in
          international schools worldwide.
        </p>
        <p className="text-sm font-semibold text-gray-500 leading-relaxed">
          국제학교 교육과정에서 사용하는{" "}
          <span className="text-gray-700 font-bold">WIDA 영어발달 표준</span>과{" "}
          <span className="text-gray-700 font-bold">Lexile 지수</span>를
          기반으로 콘텐츠를 제작합니다.
        </p>

        <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center text-xs font-black text-gray-500">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">🟢 Little Buddy · Ages 5–7 · WIDA 1–2</span>
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">🟡 Explorer · Ages 8–10 · WIDA 2–3</span>
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">🔴 Pro Buddy · Ages 11–13 · WIDA 3–4</span>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/read"
        className="inline-flex items-center gap-3 bg-orange-400 hover:bg-orange-500 text-white font-black text-lg px-8 py-4 rounded-2xl shadow-lg transition-all duration-150 hover:scale-105 hover:shadow-xl"
      >
        Start Reading
        <span className="text-xl">→</span>
      </Link>

      <p className="mt-6 text-xs font-bold text-gray-400">
        Free to read · Updated daily · No login needed
      </p>
    </main>
  );
}
