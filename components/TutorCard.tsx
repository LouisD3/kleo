'use client';

import ReactMarkdown from 'react-markdown';

interface TutorCardProps {
  tutorExplanation: string;
  accentColor: string;
  bgColor: string;
  onRetry: () => void;
  attemptCount: number;
}

export default function TutorCard({ tutorExplanation, accentColor, bgColor, onRetry, attemptCount }: TutorCardProps) {
  const explanation = tutorExplanation?.trim()
    ? tutorExplanation
    : 'Repasemos los conceptos que te faltaron. Relee la explicación con calma y enfócate en los puntos que no cubriste. ¡Tú puedes lograrlo!';

  return (
    <div className="space-y-4">
      <div
        className="rounded-3xl border-2 overflow-hidden"
        style={{ borderColor: accentColor, background: bgColor }}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: accentColor + '22', borderBottom: `2px solid ${accentColor}33` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧑‍🏫</span>
            <span className="font-black text-gray-800 text-base">Repasemos juntos</span>
          </div>
          <span
            className="text-xs font-black px-3 py-1 rounded-full text-white"
            style={{ background: accentColor }}
          >
            Intento #{attemptCount}
          </span>
        </div>
        <div className="px-5 py-4 prose prose-sm max-w-none text-gray-700 leading-relaxed prose-headings:font-black prose-strong:font-black prose-strong:text-gray-800 prose-li:text-gray-700">
          <ReactMarkdown>{explanation}</ReactMarkdown>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="w-full py-4 rounded-2xl font-black text-white text-base transition-all duration-150 active:scale-95 hover:scale-[1.02] shadow-lg"
        style={{ background: accentColor, boxShadow: `0 6px 0 ${accentColor}88` }}
      >
        ¡Intentarlo de nuevo! 💪
      </button>
    </div>
  );
}
