'use client';
import { useEffect, useState } from 'react';
import Mascot from './Mascot';

const PHRASES = [
  'Leyendo tu explicación…',
  'Comprobando los conceptos…',
  'Analizando tus ideas…',
  '¡Casi listo!',
];

interface Props {
  emoji: string;
}

export default function EvaluatingScreen({ emoji: _emoji }: Props) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % PHRASES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-white rounded-3xl z-10 flex flex-col items-center justify-center gap-5 p-8">
      <Mascot variant="inline" emotion="thinking" size={110} />
      <p className="text-base font-bold text-gray-600 text-center min-h-[1.5rem] transition-all">
        {PHRASES[phraseIndex]}
      </p>
      <div className="flex gap-2">
        {[0, 200, 400].map((delay) => (
          <div
            key={delay}
            className="w-2.5 h-2.5 rounded-full bg-blue-300"
            style={{ animation: `pulse 1s ease-in-out infinite`, animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
