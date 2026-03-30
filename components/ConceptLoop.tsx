'use client';
import { useState } from 'react';
import { LearningContent } from '@/lib/types';

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
  const [showReward, setShowReward] = useState(false);
  const [completedDots, setCompletedDots] = useState<boolean[]>(
    new Array(content.conceptPages.length).fill(false)
  );

  const total = content.conceptPages.length;
  const page = content.conceptPages[currentIndex];

  function handleCheckAnswer(index: 0 | 1) {
    if (index === page.quickCheck.correctIndex) {
      setCheckResult('correct');

      const newDots = [...completedDots];
      newDots[currentIndex] = true;
      setCompletedDots(newDots);

      setShowReward(true);
      setTimeout(() => {
        setShowReward(false);
        if (currentIndex + 1 < total) {
          setCurrentIndex(currentIndex + 1);
          setSubStep('read');
          setCheckResult(null);
        } else {
          onComplete();
        }
      }, 1000);
    } else {
      setCheckResult('wrong');
    }
  }

  return (
    <div className="relative">
      {/* Progress dots */}
      <div className="flex gap-2 justify-center mb-6">
        {content.conceptPages.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              completedDots[i]
                ? 'bg-green-500 animate-pop-in scale-110'
                : 'bg-gray-200'
            }`}
            style={
              i === currentIndex && !completedDots[i]
                ? { backgroundColor: accentColor }
                : {}
            }
          />
        ))}
      </div>

      <p className="text-center text-sm text-gray-500 mb-4">
        Concepto {currentIndex + 1} / {total}
      </p>

      {/* Reward banner */}
      {showReward && (
        <div className="absolute inset-x-0 top-0 flex justify-center z-10 animate-slide-up">
          <div className="bg-green-100 text-green-700 font-bold px-6 py-3 rounded-2xl shadow-lg text-lg">
            ¡Correcto! 🌟
          </div>
        </div>
      )}

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
          <div className="space-y-3">
            {page.quickCheck.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleCheckAnswer(i as 0 | 1)}
                disabled={checkResult === 'correct'}
                className={`w-full py-3 px-5 rounded-xl font-medium border-2 transition-all ${
                  checkResult === 'correct' && i === page.quickCheck.correctIndex
                    ? 'border-green-500 bg-green-50 text-green-700 animate-pop-in'
                    : checkResult === 'wrong' && i !== page.quickCheck.correctIndex
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-400 text-gray-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {checkResult === 'wrong' && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-xl px-4 py-3 text-center">
              💡 {page.quickCheck.hint}
            </p>
          )}
          {checkResult === 'correct' && (
            <p className="text-center text-green-600 font-bold animate-pop-in">¡Correcto! ✅</p>
          )}
        </div>
      )}
    </div>
  );
}
