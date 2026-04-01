'use client';
import { useState } from 'react';
import { LearningContent } from '@/lib/types';
import Mascot from './Mascot';

interface Props {
  content: LearningContent;
  accentColor: string;
  bgColor: string;
  onComplete: () => void;
}

type SubStep = 'read' | 'check';

export default function ConceptLoop({ content, accentColor, bgColor, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subStep, setSubStep] = useState<SubStep>('read');
  const [checkResult, setCheckResult] = useState<null | 'correct' | 'wrong'>(null);
  const [completedDots, setCompletedDots] = useState<boolean[]>(
    new Array(content.conceptPages.length).fill(false)
  );

  const total = content.conceptPages.length;
  const page = content.conceptPages[currentIndex];

  function handleCheckAnswer(index: 0 | 1) {
    if (index === page.quickCheck.correctIndex) {
      const newDots = [...completedDots];
      newDots[currentIndex] = true;
      setCompletedDots(newDots);
      setCheckResult('correct');
    } else {
      setCheckResult('wrong');
    }
  }

  function handleAdvance() {
    if (currentIndex + 1 < total) {
      setCurrentIndex(currentIndex + 1);
      setSubStep('read');
      setCheckResult(null);
    } else {
      onComplete();
    }
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${(completedDots.filter(Boolean).length / total) * 100}%`,
            backgroundColor: accentColor,
          }}
        />
      </div>

      <p className="text-center text-sm text-gray-500">
        Concepto {currentIndex + 1} / {total}
      </p>

      {/* Sub-step: Read */}
      {subStep === 'read' && (
        <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: bgColor }}>
          <div className="text-5xl text-center">{content.emoji}</div>
          <h2 className="text-xl font-bold text-center text-gray-800">{page.name}</h2>
          <p className="text-gray-700 leading-relaxed text-center">{page.explanation}</p>
          <button
            onClick={() => setSubStep('check')}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            ¡Lo tengo! →
          </button>
        </div>
      )}

      {/* Sub-step: Quick check */}
      {subStep === 'check' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 text-center">¿Lo entendiste?</h3>
          <p className="text-gray-700 text-center">{page.quickCheck.question}</p>

          {checkResult !== 'correct' && (
            <div className="space-y-3">
              {page.quickCheck.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleCheckAnswer(i as 0 | 1)}
                  className={`w-full py-3 px-5 rounded-xl font-medium border-2 transition-all ${
                    checkResult === 'wrong' && i !== page.quickCheck.correctIndex
                      ? 'border-red-300 bg-red-50 text-gray-400'
                      : 'border-gray-200 bg-white hover:border-gray-400 text-gray-800'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {checkResult === 'wrong' && (
            <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4 flex items-center gap-4 animate-pop-in">
              <div className="flex-shrink-0">
                <Mascot variant="inline" emotion="sad" size={56} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-base text-red-700">¡Casi!</p>
                <p className="text-xs mt-0.5 text-red-600 leading-snug">{page.quickCheck.hint}</p>
              </div>
            </div>
          )}

          {checkResult === 'correct' && (
            <div className="rounded-2xl border-2 border-green-300 bg-green-50 p-4 flex items-center gap-4 animate-pop-in">
              <div className="flex-shrink-0">
                <Mascot variant="inline" emotion="celebrate" size={56} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-base text-green-700">¡Correcto!</p>
              </div>
              <button
                onClick={handleAdvance}
                className="flex-shrink-0 px-5 py-2.5 rounded-2xl font-black text-white text-sm transition-all active:scale-95"
                style={{ backgroundColor: '#16a34a' }}
              >
                Siguiente →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
