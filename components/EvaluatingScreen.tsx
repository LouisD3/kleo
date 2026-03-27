'use client';
import { useEffect, useState } from 'react';

const PHRASES = [
  'Leyendo tu explicación…',
  'Comprobando los conceptos…',
  'Analizando tus ideas…',
  '¡Casi listo!',
];

interface Props {
  emoji: string;
}

export default function EvaluatingScreen({ emoji }: Props) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-white rounded-3xl z-10 flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-7xl animate-bounce">{emoji}</div>
      <p className="text-lg font-semibold text-gray-700 text-center min-h-[2rem] transition-all">
        {PHRASES[phraseIndex]}
      </p>
      <div className="flex gap-2">
        {[0, 200, 400].map((delay) => (
          <div
            key={delay}
            className="w-3 h-3 rounded-full bg-blue-400"
            style={{ animation: `pulse 1s ease-in-out infinite`, animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
      <div className="flex gap-3 text-2xl">
        {['⚛️', '🧲', '⚡', '🔬', '💡'].map((e, i) => (
          <span
            key={i}
            style={{ animation: 'bounce 1s ease-in-out infinite', animationDelay: `${i * 100}ms` }}
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}
